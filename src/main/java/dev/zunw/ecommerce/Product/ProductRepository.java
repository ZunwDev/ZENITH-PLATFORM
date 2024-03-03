package dev.zunw.ecommerce.Product;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@NonNullApi
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Optional<Product> findById(UUID id);

    Optional<Product> findByName(String name);

    @Query(value =
            "SELECT " +
                    "   CASE " +
                    "       WHEN :filterType = 'brand' THEN p.brand_id " +
                    "       WHEN :filterType = 'category' THEN p.category_id " +
                    "       WHEN :filterType = 'archived' THEN p.archived_id " +
                    "   END AS filterId, " +
                    "   COUNT(*) " +
                    "FROM " +
                    "   Product p " +
                    "WHERE " +
                    "   (COALESCE(:categoryIdsArray, '{}') = '{}' OR p.category_id = ANY(:categoryIdsArray)) AND " +
                    "   (COALESCE(:brandIdsArray, '{}') = '{}' OR p.brand_id = ANY(:brandIdsArray)) AND " +
                    "   (COALESCE(:archivedIdsArray, '{}') = '{}' OR p.archived_id = ANY(:archivedIdsArray)) " +
                    "GROUP BY " +
                    "   filterId",
            nativeQuery = true)
    List<Object[]> findCountsByFilter(
            @Param("categoryIdsArray") Long[] categoryIdsArray,
            @Param("brandIdsArray") Long[] brandIdsArray,
            @Param("archivedIdsArray") Long[] archivedIdsArray,
            @Param("filterType") String filterType);
}
