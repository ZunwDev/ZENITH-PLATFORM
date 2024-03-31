package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.Status.Status;
import dev.zunw.ecommerce.Status.StatusRepository;
import dev.zunw.ecommerce.Brand.Brand;
import dev.zunw.ecommerce.Brand.BrandRepository;
import dev.zunw.ecommerce.Category.Category;
import dev.zunw.ecommerce.Category.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final StatusRepository statusRepository;
    private Integer amount;


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
                Optional<Brand> brandOptional = brandRepository.findById(filterId);
                yield brandOptional.map(Brand::getName).orElse(null);
            }
            case "category" -> {
                Optional<Category> categoryOptional = categoryRepository.findById(filterId);
                yield categoryOptional.map(Category::getName).orElse(null);
            }
            case "status" -> {
                Optional<Status> statusOptional = statusRepository.findById(filterId);
                yield statusOptional.map(Status::getName).orElse(null);
            }
            default -> null;
        };
    }

    @Transactional
    public Boolean productExists(Product product) {
        Optional<Product> existingProduct = productRepository.findByName(product.getName());
        return existingProduct.isPresent();
    }

    @Transactional
    public Product createProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        updateCategoryAndBrandAmounts();
        return savedProduct;
    }

    @Transactional
    public Product updateProduct(Product product) {
        Product updatedProduct = productRepository.save(product);
        updateCategoryAndBrandAmounts();
        return updatedProduct;
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        productRepository.deleteById(productId);
        updateCategoryAndBrandAmounts();
    }

    public Optional<Product> getProductById(UUID id) {
        return productRepository.findById(id);
    }

    private void updateCategoryAndBrandAmounts() {
        categoryRepository.updateCategoryAmount();
        brandRepository.updateBrandAmount();
    }
}
