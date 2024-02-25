package dev.zunw.ecommerce.Product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.zunw.ecommerce.ProductBrand.ProductBrand;
import dev.zunw.ecommerce.ProductCategory.ProductCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(generator = "uuid2")
    @Column(name = "product_id", columnDefinition = "CHAR(36)")
    private UUID productId;

    private String name;

    @OneToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @OneToOne
    @JoinColumn(name = "brand_id")
    private ProductBrand brand;

    @Transient
    private transient JsonNode parsedSpecifications;
    private String description;
    private Float rating;
    private Float price;
    private String specifications;
    private Integer quantity;
    private Integer discount;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    private Boolean archived;

    public Product() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.archived = false;
        this.rating = 0.0f;
    }

    @PostLoad
    public void parseSpecifications() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            this.parsedSpecifications = mapper.readTree(specifications);
        } catch (Exception e) {
            this.parsedSpecifications = mapper.createObjectNode().put("message", "No specifications");
        }
    }
}