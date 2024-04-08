package dev.zunw.ecommerce.AttributeType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttributeTypeService {
    private final AttributeTypeRepository attributeTypeRepository;

    @Autowired
    public AttributeTypeService(AttributeTypeRepository attributeTypeRepository) {
        this.attributeTypeRepository = attributeTypeRepository;
    }

    public long getAttributeCountByAttributeTypeId(Long id) {
        return attributeTypeRepository.countByAttributeTypeId(id);
    }
}
