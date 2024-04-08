package dev.zunw.ecommerce;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Optional;

public class ServiceUtils {
    public static <T, ID> boolean existsByName(String name, JpaRepository<T, ID> repository) {
        Method findByNameMethod;
        try {
            // Attempt to retrieve the findByName method via reflection
            findByNameMethod = repository.getClass().getMethod("findByName", String.class);
        } catch (NoSuchMethodException e) {
            // If the method does not exist, return false with a descriptive error message
            throw new IllegalArgumentException("The repository does not contain a method named 'findByName'.");
        }

        try {
            Object result = findByNameMethod.invoke(repository, name);
            if (result instanceof Optional) {
                return ((Optional<?>) result).isPresent();
            } else {
                throw new IllegalArgumentException("The return type of 'findByName' method is not Optional.");
            }
        } catch (IllegalAccessException | InvocationTargetException e) {
            // Log the exception and return false
            e.printStackTrace(); // Or log the exception properly
            return false;
        }
    }

    @Transactional
    public static <T> void deleteEntityById(Long id, JpaRepository<T, Long> repository) {
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete entity with ID: " + id, e);
        }
    }

    @Transactional
    public static <T, ID> void saveEntity(T entity, JpaRepository<T, ID> repository) {
        repository.save(entity);
    }

    @Transactional(readOnly = true)
    public static <T, ID> Optional<T> findEntityById(ID id, JpaRepository<T, ID> repository) {
        return repository.findById(id);
    }

    public static <T> List<T> getAllEntities(JpaRepository<T, ?> repository) {
        return repository.findAll();
    }
}
