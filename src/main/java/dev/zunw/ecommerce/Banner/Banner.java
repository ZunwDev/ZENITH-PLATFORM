package dev.zunw.ecommerce.Banner;

import dev.zunw.ecommerce.Category.Category;
import dev.zunw.ecommerce.Status.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "banner")
public class Banner {
    @Id
    @GeneratedValue(generator = "uuid2")
    @Column(name = "banner_id", columnDefinition = "CHAR(36)")
    private UUID bannerId;

    private String name;

    private String position;

    @Column(name = "aspect_ratio")
    private String aspectRatio;

    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne
    @JoinColumn(name = "status_id")
    private Status status;

    private String link;

    @Column(name = "activation_date")
    private Date activationDate;

    @Column(name = "expiration_date")
    private Date expirationDate;

    @Column(name = "include_button")
    private Boolean includeButton;
}
