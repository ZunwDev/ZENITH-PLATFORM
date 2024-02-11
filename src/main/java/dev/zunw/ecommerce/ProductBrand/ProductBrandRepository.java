package dev.zunw.ecommerce.ProductBrand;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@NonNullApi
public interface ProductBrandRepository extends JpaRepository<ProductBrand, Long> {
}