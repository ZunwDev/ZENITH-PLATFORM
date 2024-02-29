package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.Brand.BrandRepository;
import dev.zunw.ecommerce.Category.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;


    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    public Page<Product> findByFilters(List<Long> categoryIds, List<Long> brandIds, List<Boolean> archiveIds, Pageable pageable, String sortBy, String sortDirection, String searchQuery) {
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Specification<Product> specification = ProductSpecifications.withCategoryAndBrandAndArchived(categoryIds, brandIds, archiveIds, searchQuery);
        return productRepository.findAll(specification, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
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
