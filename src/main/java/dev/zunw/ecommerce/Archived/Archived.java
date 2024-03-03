package dev.zunw.ecommerce.Archived;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "archived")
public class Archived {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "archived_id")
    private Long archivedId;

    private String name;

    private Integer amount;
}