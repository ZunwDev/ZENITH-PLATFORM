package dev.zunw.ecommerce.Banner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BannerRepository extends JpaRepository<Banner, UUID>,
        JpaSpecificationExecutor<Banner> {
    Optional<Banner> findByName(String name);
}
