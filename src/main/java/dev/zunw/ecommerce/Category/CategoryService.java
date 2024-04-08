package dev.zunw.ecommerce.Category;

import dev.zunw.ecommerce.Product.Product;
import dev.zunw.ecommerce.Product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static dev.zunw.ecommerce.ServiceUtils.getAllEntities;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<Category> getAllProductCategories() {
        List<Category> categories = getAllEntities(categoryRepository);
        List<Product> products = getAllEntities(productRepository);

        Map<Long, Integer> occurrences = new HashMap<>();
        for (Product product : products) {
            Long id = product.getCategory().getCategoryId();
            occurrences.put(id, occurrences.getOrDefault(id, 0) + 1);
        }
        for (Category category : categories) {
            Long brandId = category.getCategoryId();
            Integer occurrencesFinal = occurrences.getOrDefault(brandId, 0);
            category.setAmount(occurrencesFinal);
        }

        return categories;
    }
}
