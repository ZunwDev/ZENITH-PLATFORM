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
    public static <T, ID> void deleteRowById(ID id, JpaRepository<T, ID> repository) {
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete entity with ID: " + id, e);
        }
    }

    @Transactional
    public static <T, ID> T saveEntity(T entity, JpaRepository<T, ID> repository) {
        return repository.save(entity);
    }

    @Transactional(readOnly = true)
    public static <T, ID> Optional<T> findRowById(ID id, JpaRepository<T, ID> repository) {
        return id == null ? Optional.empty() : repository.findById(id);
    }

    public static <T> List<T> getAllRows(JpaRepository<T, ?> repository) {
        return repository.findAll();
    }

    public static <T> void setProperty(T entity, String methodName, Class<?> parameterType, Object value)
            throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Method method = entity.getClass().getMethod(methodName, parameterType);
        method.invoke(entity, value);
    }

    public static String capitalizeIfNotCapitalized(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        char firstChar = value.charAt(0);
        if (!Character.isUpperCase(firstChar)) {
            return Character.toUpperCase(firstChar) + value.substring(1);
        }
        return value;
    }
}
