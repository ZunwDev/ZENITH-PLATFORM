package dev.zunw.ecommerce.repository;

import dev.zunw.ecommerce.model.Status;
import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@NonNullApi
public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findById(Long id);

    Optional<Status> findByName(String name);

    @Query(value = "SELECT * FROM Status s WHERE LOWER(s.name) = LOWER(:name)", nativeQuery = true)
    Optional<Status> findByLowerName(@Param("name") String name);
}