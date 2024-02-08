package dev.zunw.ecommerce.Product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "product")
public class Product {
        @Id
        @GeneratedValue(generator = "uuid2")
        @Column(name = "product_id", columnDefinition = "CHAR(36)")
        private Long productId;

        private String name;

        @Column(name = "category_id")
        private Integer categoryId;

        private String description;
        private Float rating;
        private Float price;

        private String specifications;

        private Integer quantity;

        private Integer discount;

        @Column(name = "brand_id")
        private Integer brandId;
}