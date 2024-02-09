package dev.zunw.ecommerce.Product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Boolean archived;

    public Product() {
        this.createdAt = LocalDateTime.now();
        this.archived = false;
        this.rating = (float) 0;
    }
}