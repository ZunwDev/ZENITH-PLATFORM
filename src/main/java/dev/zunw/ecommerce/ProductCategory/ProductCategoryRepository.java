package dev.zunw.ecommerce.ProductCategory;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@NonNullApi
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
