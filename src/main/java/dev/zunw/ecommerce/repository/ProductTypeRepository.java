package dev.zunw.ecommerce.repository;

import dev.zunw.ecommerce.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Long>,
        JpaSpecificationExecutor<ProductType> {

    Optional<ProductType> findByName(String name);

    List<ProductType> findByCategoryId(Long id);
}
