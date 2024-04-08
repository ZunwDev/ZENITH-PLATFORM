package dev.zunw.ecommerce.Category;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@NonNullApi
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Modifying
    @Query("UPDATE Category c SET c.amount = (SELECT COUNT(p) FROM Product p WHERE p.category.categoryId = c.categoryId)")
    void updateCategoryAmount();

    Optional<Category> findByName(String name);
}
