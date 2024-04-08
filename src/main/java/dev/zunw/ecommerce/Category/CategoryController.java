package dev.zunw.ecommerce.Category;

import dev.zunw.ecommerce.Product.ProductService;
import dev.zunw.ecommerce.dto.AttributeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Supplier;

import static dev.zunw.ecommerce.Attribute.AttributeUtils.*;
import static dev.zunw.ecommerce.ServiceUtils.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryController(CategoryService categoryService, ProductService productService, CategoryRepository categoryRepository
    ) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping()
    public ResponseEntity<Object> getCategories() {
        return ResponseEntity.ok(categoryService.getAllProductCategories());
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<Object> updateCategory(@PathVariable Long categoryId,
                                                 @RequestBody AttributeRequest data) {
        BiFunction<String, Optional<Category>, Category> updateFunction = (name, optionalCategory) -> updateEntity(name, optionalCategory, category -> saveEntity(category, categoryRepository));
        return updateAttribute(categoryId, data.getData().getName(), data.getData().getOldValue(),
                () -> findEntityById(categoryId, categoryRepository),
                categoryRepository,
                updateFunction,
                "Category");
    }

    @PostMapping
    public ResponseEntity<Object> newCategory(@RequestBody AttributeRequest data) {
        String name = data.getData().getName();
        Supplier<Category> newFunction = () -> newEntity(data, Category::new,
                category -> saveEntity(category, categoryRepository));
        return createAttribute(name, categoryRepository, newFunction, "Category");
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Object> deleteCategory(@PathVariable Long categoryId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optionalCategory) -> {
                    deleteEntityById(categoryId, categoryRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(categoryId,
                () -> findEntityById(categoryId, categoryRepository),
                productService::getProductCountByCategoryId,
                deleteFunction, "Category"
        );
    }
}
