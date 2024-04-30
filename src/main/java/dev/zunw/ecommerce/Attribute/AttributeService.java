package dev.zunw.ecommerce.Attribute;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttributeService {
    private final AttributeRepository attributeRepository;

    @Autowired
    public AttributeService(AttributeRepository attributeRepository) {
        this.attributeRepository = attributeRepository;
    }

    public List<String> getByAttributeTypeId(Long attributeTypeId) {
        List<Attribute> attributes = attributeRepository.findByAttributeTypeIdOrderByAttributeId(attributeTypeId);
        return attributes.stream()
                .map(Attribute::getName)
                .collect(Collectors.toList());
    }
}
