package dev.zunw.ecommerce.UserCredentials;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@NonNullApi
public interface UserCredentialsRepository extends JpaRepository<UserCredentials, Long> {
}
