package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.ProductCategory.ProductCategory;
import dev.zunw.ecommerce.ProductCategory.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;


    @Autowired
    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    };

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
}
