package dev.zunw.ecommerce.Product;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@NonNullApi
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findById(Long id);
}
