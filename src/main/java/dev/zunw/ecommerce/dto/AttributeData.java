package dev.zunw.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AttributeData {
    private String name;
    private Long categoryId;
    private String oldValue;
    private Long attributeTypeId;
}
