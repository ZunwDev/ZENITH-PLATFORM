package dev.zunw.ecommerce.Banner;

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

    @Query(value =
            "SELECT " +
                    "   CASE " +
                    "       WHEN :filterType = 'brand' THEN p.brand_id " +
                    "       WHEN :filterType = 'status' THEN p.status_id " +
                    "   END AS filterId, " +
                    "   COUNT(*) " +
                    "FROM " +
                    "   banner p " +
                    "WHERE " +
                    "   (COALESCE(:categoryIdsArray, '{}') = '{}' OR p.category_id = ANY(:categoryIdsArray)) AND " +
                    "   (COALESCE(:statusIdsArray, '{}') = '{}' OR p.status_id = ANY(:statusIdsArray)) " +
                    "GROUP BY " +
                    "   filterId",
            nativeQuery = true)
    List<Object[]> findCountsByFilter(
            @Param("categoryIdsArray") Long[] categoryIdsArray,
            @Param("statusIdsArray") Long[] statusIdsArray,
            @Param("filterType") String filterType);

}
