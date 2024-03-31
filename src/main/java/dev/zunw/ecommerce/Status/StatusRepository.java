package dev.zunw.ecommerce.Status;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@NonNullApi
public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findById(Long id);
}