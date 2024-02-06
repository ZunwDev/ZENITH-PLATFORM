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
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "product_id")
        private Long productId;

        private String name;

        @Column(name = "category_id")
        private Integer categoryId;

        private String description;
        private Float rating;
        private Float price;

        private String specifications;

        private Integer quantity;
}