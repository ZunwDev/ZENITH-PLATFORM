package dev.zunw.ecommerce.User;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(generator = "uuid2")
    @Column(name = "user_id", columnDefinition = "CHAR(36)")
    private UUID userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private Boolean verified;
    private String email;

    @Column(name = "role_id")
    private UUID roleId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.verified = false;

        Dotenv dotenv = Dotenv.load();
        this.roleId = UUID.fromString(Objects.requireNonNull(dotenv.get("BASE_UUID_FOR_USER_ROLE")));
    }
}

