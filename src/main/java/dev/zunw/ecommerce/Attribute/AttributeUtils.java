package dev.zunw.ecommerce.Attribute;

import dev.zunw.ecommerce.ResponseUtils;
import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.AttributeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

public class AttributeUtils {

    public static <T> T updateEntity(String updatedName, Optional<T> entity,
                                     Consumer<T> saveOperation) {
        if (entity.isPresent()) {
            T existingEntity = entity.get();
            try {
                Method setNameMethod = existingEntity.getClass().getMethod("setName", String.class);
                setNameMethod.invoke(existingEntity, updatedName);
                saveOperation.accept(existingEntity);
                return existingEntity;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                // Handle exception
                return null;
            }
        }
        // Entity not present
        return null;
    }

    public static <T> T newEntity(AttributeRequest data, Supplier<T> entitySupplier,
                                  Consumer<T> saveOperation) {
        T newEntity = entitySupplier.get();
        try {
            Method setNameMethod = newEntity.getClass().getMethod("setName", String.class);
            setNameMethod.invoke(newEntity, data.getData().getName());

            // Check if attributeTypeId exists in the data
            if (data.getData().getAttributeTypeId() != null) {
                Method setAttributeTypeId = newEntity.getClass().getMethod("setAttributeTypeId",
                        Long.class);
                setAttributeTypeId.invoke(newEntity, data.getData().getAttributeTypeId());
            }

            saveOperation.accept(newEntity);
            return newEntity;
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            // Handle exception
            return null;
        }
    }

    public static void checkCount(Long id, String type,
                                  Function<Long, Long> countFunction,
                                  String entityType) {
        if (countFunction != null) {
            long count = countFunction.apply(id);
            if (count != 0) {
                String text = (count == 1) ? entityType : (entityType + "s");
                String verbText = (count == 1) ? "is" : "are";
                ResponseUtils.conflictResponse(String.format("Cannot delete %s with " +
                        "<strong>ID %d</strong> because there %s <strong>%d %s</strong> assigned to that %s", type, id, verbText, count, text, type));
            }
        }
    }

    public static <T> ResponseEntity<Object> updateAttribute(Long id, String name, String oldValue,
                                                             Supplier<Optional<T>> serviceGetter,
                                                             JpaRepository<T, Long> repository,
                                                             BiFunction<String, Optional<T>, T> updateFunction,
                                                             String type) {
        try {
            Optional<T> existingOptional = serviceGetter.get();
            if (existingOptional.isEmpty()) {
                return ResponseUtils.notFoundResponse(String.format("%s with ID <strong>%d</strong> not found", type, id));
            }

            if (Objects.equals(name, oldValue)) {
                return null;
            }

            if (ServiceUtils.existsByName(name, repository)) {
                return ResponseUtils.conflictResponse(String.format("%s named <strong>%s</strong> already exists", type, name));
            }

            T updatedEntity = updateFunction.apply(name, existingOptional);
            return ResponseUtils.successResponse(String.format("%s updated from <strong>%s</strong> to <strong>%s</strong> successfully", type, oldValue, name), String.format("%s Update", type), Optional.of(updatedEntity));
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse(String.format("Failed to update %s with ID <strong>%d</strong>", type, id));
        }
    }

    // Common method for creating an attribute
    public static <T> ResponseEntity<Object> createAttribute(String name,
                                                             JpaRepository<T, Long> repository,
                                                             Supplier<T> newEntityFunction,
                                                             String type) {
        try {
            if (ServiceUtils.existsByName(name, repository)) {
                return ResponseUtils.conflictResponse(String.format("%s named <strong>%s</strong> already exists", type, name));
            }
            T attribute = newEntityFunction.get();
            return ResponseUtils.createdResponse(String.format("%s named <strong>%s</strong> added successfully", type, name), String.format("%s Addition", type), Optional.ofNullable(attribute));
        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace();
            return ResponseUtils.serverErrorResponse(String.format("Failed to add %s named <strong>%s</strong>", type, name));
        }
    }

    // Common method for deleting an attribute
    public static ResponseEntity<Object> deleteAttribute(Long id, Supplier<Optional<?>> serviceGetter,
                                                         Function<Long, Long> countFunction,
                                                         BiFunction<String, Optional<?>, Boolean> deleteFunction,
                                                         String type) {
        try {
            Optional<?> optional = serviceGetter.get();
            if (optional.isEmpty()) {
                return ResponseUtils.notFoundResponse(String.format("No %s with <strong>ID %d</strong> found", type, id));
            }
            if (countFunction != null && Objects.equals(type, "Brand") || Objects.equals(type,
                    "Category")) {
                checkCount(id, type, countFunction, "product");
            }
            if (countFunction != null && Objects.equals(type, "Attribute Type")) {
                checkCount(id, type, countFunction, "attribute");
            }
            deleteFunction.apply(type, optional);
            return ResponseUtils.successResponse(String.format("%s with <strong>ID %d</strong> deleted successfully", type, id), String.format("%s Deletion", type), Optional.empty());
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse(String.format("Failed to delete %s with <strong>ID %d</strong>", type, id));
        }
    }
}
