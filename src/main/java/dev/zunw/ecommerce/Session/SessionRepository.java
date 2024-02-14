package dev.zunw.ecommerce.Session;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@NonNullApi
public interface SessionRepository extends JpaRepository<Session, UUID> {
    Optional<Session> findById(UUID id);
}
