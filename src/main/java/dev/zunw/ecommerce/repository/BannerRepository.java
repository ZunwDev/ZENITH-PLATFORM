package dev.zunw.ecommerce.repository;

import dev.zunw.ecommerce.model.Banner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BannerRepository extends JpaRepository<Banner, UUID>,
        JpaSpecificationExecutor<Banner> {
    Optional<Banner> findByName(String name);

    List<Banner> findByPosition(String position);

    @Query(value = "SELECT DISTINCT b.* FROM Banner b " +
            "LEFT JOIN Status s ON b.status_id = s.status_id " +
            "LEFT JOIN Category c ON b.category_id = c.category_id " +
            "WHERE (:positions IS NULL OR LOWER(b.position) IN :positions) " +
            "AND (:categories IS NULL OR LOWER(c.name) IN (:categories)) " +
            "AND (:statuses IS NULL OR LOWER(s.name) IN :statuses) " +
            "AND (:aspectRatios IS NULL OR LOWER(b.aspect_ratio) IN :aspectRatios) " +
            "AND (:searchQuery IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))",
            countQuery = "SELECT count(DISTINCT b.banner_id) FROM Banner b " +
                    "LEFT JOIN Status s ON b.status_id = s.status_id " +
                    "LEFT JOIN Category c ON b.category_id = c.category_id " +
                    "WHERE (:positions IS NULL OR LOWER(b.position) IN :positions) " +
                    "AND (:categories IS NULL OR LOWER(c.name) IN (:categories)) " +
                    "AND (:statuses IS NULL OR LOWER(s.name) IN :statuses) " +
                    "AND (:aspectRatios IS NULL OR LOWER(b.aspect_ratio) IN :aspectRatios) " +
                    "AND (:searchQuery IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))",
            nativeQuery = true)
    Page<Banner> findByFilters(
            @Param("positions") List<String> positions,
            @Param("categories") List<String> categories,
            @Param("statuses") List<String> statuses,
            @Param("aspectRatios") List<String> aspectRatios,
            @Param("searchQuery") String searchQuery,
            Pageable pageable
    );
}
