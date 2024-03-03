package dev.zunw.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FilterInfo {
    private final Integer amount;
    private final String name;

    public FilterInfo(Integer amount, String name) {
        this.amount = amount;
        this.name = name;
    }
}
