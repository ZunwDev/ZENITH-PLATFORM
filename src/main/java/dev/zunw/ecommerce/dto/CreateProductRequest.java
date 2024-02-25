package dev.zunw.ecommerce.dto;

import dev.zunw.ecommerce.Product.Product;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateProductRequest {
    private Product product;
}
