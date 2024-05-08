package dev.zunw.ecommerce.repository;

import dev.zunw.ecommerce.model.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    List<Attribute> findByAttributeTypeIdOrderByAttributeId(Long attributeId);

    Optional<Attribute> findByName(String name);
}
