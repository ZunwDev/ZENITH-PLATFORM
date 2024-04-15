package dev.zunw.ecommerce.Product;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.zunw.ecommerce.Brand.Brand;
import dev.zunw.ecommerce.Category.Category;
import dev.zunw.ecommerce.Status.Status;
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
    private Category category;

    @OneToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @OneToOne
    @JoinColumn(name = "status_id")
    private Status status;

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