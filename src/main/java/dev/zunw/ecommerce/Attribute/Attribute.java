package dev.zunw.ecommerce.Attribute;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "attribute")
public class Attribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attribute_id")
    private Long attributeId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "attribute_type_id")
    private Long attributeTypeId;

    private String name;
}
