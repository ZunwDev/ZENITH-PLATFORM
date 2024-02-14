package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.ProductBrand.ProductBrand;
import dev.zunw.ecommerce.ProductBrand.ProductBrandRepository;
import dev.zunw.ecommerce.ProductCategory.ProductCategory;
import dev.zunw.ecommerce.ProductCategory.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductBrandRepository productBrandRepository;


    @Autowired
    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository, ProductBrandRepository productBrandRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.productBrandRepository = productBrandRepository;
    }

    public Page<Product> findByFilters(List<Long> categoryIds, List<Long> brandIds, List<Boolean> archiveIds, Pageable pageable) {
        if (categoryIds == null && brandIds == null && archiveIds == null) {
            return productRepository.findAll(pageable);
        } else {
            return productRepository.findAll(ProductSpecifications.withCategoryAndBrandAndArchived(categoryIds, brandIds, archiveIds), pageable);
        }
    }

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public List<ProductBrand> getAllProductBrands() {
        return productBrandRepository.findAll();
    }

    public Optional<Product> getProductById(UUID id) {
        return productRepository.findById(id);
    }
}
