package dev.zunw.ecommerce.Attribute;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    List<Attribute> findByAttributeTypeIdOrderByAttributeId(Long attributeId);

    List<Attribute> findByCategoryIdAndAttributeTypeIdOrderByAttributeId(Long categoryId, Long attributeId);
}
