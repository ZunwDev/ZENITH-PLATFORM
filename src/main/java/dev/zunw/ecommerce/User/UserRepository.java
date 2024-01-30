package dev.zunw.ecommerce.User;

import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@NonNullApi
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by id
    Optional<User> findById(Long id);

    // Custom query to find users by email
    Optional<User> findByEmailIgnoreCase(String email);

    // Custom query to find users by email ending with a specific domain
    List<User> findByEmailEndingWith(String domain);

    List<User> findByUserRoleId(Integer role);
}