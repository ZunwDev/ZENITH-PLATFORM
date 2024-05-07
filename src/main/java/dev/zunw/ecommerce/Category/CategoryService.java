package dev.zunw.ecommerce.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public long getCategoryIdByName(String name) {
        return categoryRepository.findIdByLowerName(name);
    }
}
