package dev.zunw.ecommerce.Archived;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@NonNullApi
public interface ArchivedRepository extends JpaRepository<Archived, Long> {
    Optional<Archived> findById(Long id);
}