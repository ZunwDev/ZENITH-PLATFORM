package dev.zunw.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.zunw.ecommerce.dto.ProductTypeCount;
import dev.zunw.ecommerce.model.Brand;
import dev.zunw.ecommerce.model.Category;
import dev.zunw.ecommerce.model.Product;
import dev.zunw.ecommerce.model.Status;
import dev.zunw.ecommerce.repository.BrandRepository;
import dev.zunw.ecommerce.repository.CategoryRepository;
import dev.zunw.ecommerce.repository.ProductRepository;
import dev.zunw.ecommerce.repository.StatusRepository;
import dev.zunw.ecommerce.specification.ProductSpecifications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static dev.zunw.ecommerce.utils.ServiceUtils.findRowById;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final StatusRepository statusRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, BrandRepository brandRepository, StatusRepository statusRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.statusRepository = statusRepository;
    }

    public Page<Product> findByFilters(List<Long> categoryIds, List<Long> brandIds, List<Long> statusIds, Pageable pageable, String sortBy, String sortDirection, String searchQuery) {
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Specification<Product> specification = ProductSpecifications.withAllFilters(categoryIds,
                brandIds, statusIds, searchQuery);
        return productRepository.findAll(specification, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
    }

    public Map<String, List<Map<String, Object>>> getFilterCounts(Long[] categoryIds, Long[] brandIds, Long[] statusIds) {
        Map<String, List<Map<String, Object>>> filterCounts = new HashMap<>();

        for (String filterType : List.of("brand", "category", "status")) {
            List<Object[]> counts = productRepository.findCountsByFilter(categoryIds, brandIds, statusIds, filterType);

            List<Map<String, Object>> countsList = new ArrayList<>();
            for (Object[] count : counts) {
                Long filterId = (Long) count[0];
                Integer amount = ((Number) count[1]).intValue();
                String name = getNameFromRepository(filterType, filterId);

                Map<String, Object> filterInfo = new HashMap<>();
                filterInfo.put(filterType + "Id", filterId);
                filterInfo.put("amount", amount);
                filterInfo.put("name", name);
                countsList.add(filterInfo);
            }
            filterCounts.put(filterType, countsList);
        }

        return filterCounts;
    }

    private String getNameFromRepository(String filterType, Long filterId) {
        return switch (filterType) {
            case "brand" -> {
                Optional<Brand> brandOptional =
                        findRowById(filterId, brandRepository);
                yield brandOptional.map(Brand::getName).orElse(null);
            }
            case "category" -> {
                Optional<Category> categoryOptional = findRowById(filterId, categoryRepository);
                yield categoryOptional.map(Category::getName).orElse(null);
            }
            case "status" -> {
                Optional<Status> statusOptional = findRowById(filterId, statusRepository);
                yield statusOptional.map(Status::getName).orElse(null);
            }
            default -> null;
        };
    }

    private String getProductTypeFromSpecs(String specs) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(specs);
            return rootNode.get("PRODUCT TYPE").asText();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, List<ProductTypeCount>>[] getProductTypeCountsByCategory() {
        List<Product> products = productRepository.findAll();

        // Group products by category
        Map<Category, List<Product>> productsByCategory = products.stream()
                .collect(Collectors.groupingBy(Product::getCategory));

        // Sort categories by categoryId
        List<Map.Entry<Category, List<Product>>> sortedCategories = productsByCategory.entrySet().stream()
                .sorted(Comparator.comparing(entry -> entry.getKey().getCategoryId()))
                .toList();

        // Initialize result array
        @SuppressWarnings("unchecked")
        Map<String, List<ProductTypeCount>>[] result = new HashMap[sortedCategories.size()];

        int index = 0;
        // Count occurrences of each product type for each category
        for (Map.Entry<Category, List<Product>> entry : sortedCategories) {
            Category category = entry.getKey();
            List<Product> categoryProducts = entry.getValue();

            Map<String, Integer> typeOccurrences = new HashMap<>();
            for (Product product : categoryProducts) {
                String productType = getProductTypeFromSpecs(product.getSpecifications());
                typeOccurrences.put(productType, typeOccurrences.getOrDefault(productType, 0) + 1);
            }

            // Create objects representing product types and their counts for the category
            List<ProductTypeCount> typeCounts = new ArrayList<>();
            for (Map.Entry<String, Integer> typeEntry : typeOccurrences.entrySet()) {
                typeCounts.add(new ProductTypeCount(typeEntry.getKey(), typeEntry.getValue()));
            }

            // Create HashMap for this category
            Map<String, List<ProductTypeCount>> categoryMap = new HashMap<>();
            categoryMap.put(category.getName(), typeCounts);

            // Add to the result array
            result[index++] = categoryMap;
        }

        return result;
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        productRepository.deleteById(productId);
    }

    public Optional<Product> getProductById(UUID id) {
        return productRepository.findById(id);
    }

    public long getProductCountByCategoryId(Long id) {
        return productRepository.countByCategoryCategoryId(id);
    }

    public long getProductCountByBrandId(Long id) {
        return productRepository.countByBrandBrandId(id);
    }
}
