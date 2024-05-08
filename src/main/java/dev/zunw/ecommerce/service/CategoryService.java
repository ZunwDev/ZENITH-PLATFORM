package dev.zunw.ecommerce.service;

import dev.zunw.ecommerce.model.Category;
import dev.zunw.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static dev.zunw.ecommerce.utils.ServiceUtils.getAllRows;

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

    public long getCategoryIdByName(String name) {
        return categoryRepository.findIdByLowerName(name);
    }
}
