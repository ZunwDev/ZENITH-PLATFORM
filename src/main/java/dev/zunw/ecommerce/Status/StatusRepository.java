package dev.zunw.ecommerce.Status;

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

    @Query("SELECT s.id FROM Status s WHERE LOWER(s.name) = LOWER(:name)")
    long findIdByLowerName(@Param("name") String name);
}