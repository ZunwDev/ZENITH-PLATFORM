package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.ProductCategory.ProductCategory;
import dev.zunw.ecommerce.ProductCategory.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;


    @Autowired
    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    public List<Product> getProductsByAttributeId(int page, int limit, Long id, String attribute) {
        Pageable pageable = PageRequest.of(page, limit);
        if (attribute == null) {
            return productRepository.findAll(pageable).getContent(); //Return all if attribute isn't set
        }

        return switch (attribute) { //Return all if any filter is set in attribute
            case "category" -> productRepository.findByCategoryProductCategoryId(pageable, id);
            case "brand" -> productRepository.findByBrandBrandId(pageable, id);
            default -> productRepository.findAll(pageable).getContent();
        };
    }

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public Optional<Product> getProductById(UUID id) {
        return productRepository.findById(id);
    }
}
