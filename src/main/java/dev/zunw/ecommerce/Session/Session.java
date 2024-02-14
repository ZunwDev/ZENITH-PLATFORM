package dev.zunw.ecommerce.Session;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "session")
public class Session {
    @Id
    @GeneratedValue(generator = "uuid2")
    @Column(name = "session_id", columnDefinition = "CHAR(36)")
    private UUID sessionId;

    @Column(name = "role_id")
    private UUID roleId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "expiration_time")
    private LocalDateTime expirationTime;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "is_admin")
    private Boolean isAdmin;
}