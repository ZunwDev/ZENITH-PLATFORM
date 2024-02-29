package dev.zunw.ecommerce.Brand;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@NonNullApi
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findById(Long id);

    @Modifying
    @Query("UPDATE Brand b SET b.amount = (SELECT COUNT(p) FROM Product p WHERE p.brand.brandId = b.brandId)")
    void updateBrandAmount();
}