package dev.zunw.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductTypeCount {
    private String name;
    private Integer amount;

    public ProductTypeCount(String name, Integer amount) {
        this.name = name;
        this.amount = amount;
    }
}