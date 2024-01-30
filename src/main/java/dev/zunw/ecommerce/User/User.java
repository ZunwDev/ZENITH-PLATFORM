package dev.zunw.ecommerce.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private Boolean verified;
    private String email;

    @Column(name = "user_role_id")
    private Integer userRoleId;

    @Column(name = "created_at")
    private String createdAt;
}

