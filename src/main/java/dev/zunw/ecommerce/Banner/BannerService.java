package dev.zunw.ecommerce.Banner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {
    private final BannerRepository bannerRepository;

    @Autowired
    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public Page<Banner> findByFilters(List<Long> categoryIds,
                                      List<Long> statusIds, Pageable pageable, String searchQuery) {
        Specification<Banner> specification =
                BannerSpecifications.withAllFilters(categoryIds, statusIds,
                        searchQuery);
        return bannerRepository.findAll(specification, PageRequest.of(pageable.getPageNumber(),
                pageable.getPageSize()));
    }
}
