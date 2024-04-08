package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.Brand.Brand;
import dev.zunw.ecommerce.Brand.BrandRepository;
import dev.zunw.ecommerce.Category.Category;
import dev.zunw.ecommerce.Category.CategoryRepository;
import dev.zunw.ecommerce.Status.Status;
import dev.zunw.ecommerce.Status.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static dev.zunw.ecommerce.ServiceUtils.findEntityById;

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
        Specification<Product> specification = ProductSpecifications.withCategoryAndBrandAndStatus(categoryIds, brandIds, statusIds, searchQuery);
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
                        findEntityById(filterId, brandRepository);
                yield brandOptional.map(Brand::getName).orElse(null);
            }
            case "category" -> {
                Optional<Category> categoryOptional = findEntityById(filterId, categoryRepository);
                yield categoryOptional.map(Category::getName).orElse(null);
            }
            case "status" -> {
                Optional<Status> statusOptional = findEntityById(filterId, statusRepository);
                yield statusOptional.map(Status::getName).orElse(null);
            }
            default -> null;
        };
    }

    @Transactional
    public Product saveProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        updateCategoryAndBrandAmounts();
        return savedProduct;
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        productRepository.deleteById(productId);
        updateCategoryAndBrandAmounts();
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

    private void updateCategoryAndBrandAmounts() {
        categoryRepository.updateCategoryAmount();
        brandRepository.updateBrandAmount();
    }
}
