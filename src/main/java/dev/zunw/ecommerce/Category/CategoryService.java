package dev.zunw.ecommerce.Category;

import dev.zunw.ecommerce.Product.Product;
import dev.zunw.ecommerce.Product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static dev.zunw.ecommerce.ServiceUtils.getAllRows;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllProductCategories() {
        return getAllRows(categoryRepository);
    }
}
