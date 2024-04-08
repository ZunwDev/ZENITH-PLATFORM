package dev.zunw.ecommerce.AttributeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttributeTypeRepository extends JpaRepository<AttributeType, Long> {

    long countByAttributeTypeId(Long attributeTypeId);

    Optional<AttributeType> findByName(String name);
}
