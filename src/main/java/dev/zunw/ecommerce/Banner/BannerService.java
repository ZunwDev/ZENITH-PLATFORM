package dev.zunw.ecommerce.Banner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

import static dev.zunw.ecommerce.ServiceUtils.capitalizeIfNotCapitalized;

@Service
public class BannerService {
    private final BannerRepository bannerRepository;

    @Autowired
    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public Map<String, Object> filterData(List<String> positions, List<String> categories,
                                          List<String> statuses, List<String> aspectRatios,
                                          Pageable pageable, String searchQuery) {
        try {
            Page<Banner> filteredBannersPage = getFilteredBannerData(positions, categories, statuses,
                    aspectRatios, pageable, searchQuery);

            List<Map<String, Object>> filters = new ArrayList<>();
            filters.add(createFilter("Position", "position", filteredBannersPage.getContent()));
            filters.add(createFilter("Category", "category", filteredBannersPage.getContent()));
            filters.add(createFilter("Status", "status", filteredBannersPage.getContent()));
            filters.add(createFilter("Aspect Ratio", "aspectRatio", filteredBannersPage.getContent()));
            filters.removeIf(Objects::isNull);

            Map<String, Object> filteredData = new HashMap<>();
            filteredData.put("filters", filters);
            return filteredData;
        } catch (DataAccessException e) {
            throw new RuntimeException("An error occurred while processing the request.");
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred.");
        }
    }

    public Page<Banner> getFilteredBannerData(List<String> positions, List<String> categories,
                                              List<String> statuses, List<String> aspectRatios,
                                              Pageable pageable, String searchQuery) {
        try {
            if (positions == null && categories == null && statuses == null && aspectRatios == null) {
                return bannerRepository.findAll(pageable);
            } else {
                return bannerRepository.findByFilters(
                        Optional.ofNullable(positions).orElse(Collections.emptyList()),
                        Optional.ofNullable(categories).orElse(Collections.emptyList()),
                        Optional.ofNullable(statuses).orElse(Collections.emptyList()),
                        Optional.ofNullable(aspectRatios).orElse(Collections.emptyList()),
                        searchQuery,
                        pageable
                );
            }
        } catch (DataAccessException e) {
            throw new RuntimeException("An error occurred while accessing the database.");
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred.");
        }
    }

    private Map<String, Object> createFilter(String filterName, String id,
                                             List<Banner> filteredBanners) {
        List<Map<String, Object>> filterable = new ArrayList<>();
        Map<Object, Long> uniqueValues = new HashMap<>();

        filteredBanners.forEach(banner -> {
            Object value = getValueFromFilterName(filterName, banner);
            if (value != null) {
                uniqueValues.computeIfAbsent(value, k -> {
                    return filteredBanners.stream()
                            .filter(b -> value.equals(getValueFromFilterName(filterName, b)))
                            .count();
                });
            }
        });

        uniqueValues.forEach((value, existingAmount) -> {
            Map<String, Object> valueMap = new HashMap<>();
            valueMap.put("name", value instanceof String ? capitalizeIfNotCapitalized((String) value) : value.toString());
            valueMap.put("id", id);
            valueMap.put("existingAmount", existingAmount);
            filterable.add(valueMap);
        });

        if (!filterable.isEmpty()) {
            Map<String, Object> filter = new HashMap<>();
            filter.put("filterName", filterName);
            filter.put("filterable", filterable);
            filter.put("filterId", id);
            return filter;
        } else {
            return null;
        }
    }

    private Object getValueFromFilterName(String filterName, Banner banner) {
        String name = filterName.toLowerCase();
        switch (name) {
            case "position" -> {
                return banner.getPosition();
            }
            case "category" -> {
                return banner.getCategory() != null ? banner.getCategory().getName() : null;
            }
            case "status" -> {
                return banner.getStatus() != null ? banner.getStatus().getName() : null;
            }
            case "aspect ratio" -> {
                return banner.getAspectRatio();
            }
            default -> {
                return null;
            }
        }
    }
}
