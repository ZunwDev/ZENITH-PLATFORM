package dev.zunw.ecommerce.Attribute;

import dev.zunw.ecommerce.ResponseUtils;
import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.AttributeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.util.Objects;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import static dev.zunw.ecommerce.ServiceUtils.setProperty;

public class AttributeUtils {

    public static <T> T updateEntity(AttributeRequest data, Optional<T> entity,
                                     Consumer<T> saveOperation) {
        if (entity.isPresent()) {
            T existingEntity = entity.get();
            try {
                // Validate data
                if (data == null || data.getData() == null) {
                    throw new IllegalArgumentException("Invalid data provided");
                }

                // Set name
                String name = data.getData().getName();
                if (name != null) {
                    setProperty(existingEntity, "setName", String.class, name);
                }

                // Set category ID
                Long categoryId = data.getData().getCategoryId();
                if (categoryId != null) {
                    setProperty(existingEntity, "setCategoryId", Long.class, categoryId);
                }

                saveOperation.accept(existingEntity);
                return existingEntity;
            } catch (Exception e) {
                // Handle exceptions properly (e.g., log or rethrow)
                e.printStackTrace();
                return null;
            }
        }
        // Entity not present
        return null;
    }

    public static <T> T newEntity(AttributeRequest data, Supplier<T> entitySupplier,
                                  Consumer<T> saveOperation) {
        try {
            T newEntity = entitySupplier.get();

            // Validate data
            if (data == null || data.getData() == null) {
                throw new IllegalArgumentException("Invalid data provided");
            }

            // Set name
            String name = data.getData().getName();
            if (name != null) {
                setProperty(newEntity, "setName", String.class, name);
            }

            // Set attribute type ID
            Long attributeTypeId = data.getData().getAttributeTypeId();
            if (attributeTypeId != null) {
                setProperty(newEntity, "setAttributeTypeId", Long.class, attributeTypeId);
            }

            // Set category ID
            Long categoryId = data.getData().getCategoryId();
            if (categoryId != null) {
                setProperty(newEntity, "setCategoryId", Long.class, categoryId);
            }

            // Perform save operation
            saveOperation.accept(newEntity);
            return newEntity;
        } catch (Exception e) {
            // Handle exceptions properly (e.g., log or rethrow)
            e.printStackTrace();
            return null;
        }
    }

    public static ResponseEntity<Object> checkCount(Long id, String type,
                                                    Function<Long, Long> countFunction,
                                                    String entityType) {
        if (countFunction != null && countFunction.apply(id) != 0) {
            long count = countFunction.apply(id);
            String text = (count == 1) ? entityType : (entityType + "s");
            String verbText = (count == 1) ? "is" : "are";
            return ResponseUtils.conflictResponse(String.format("Cannot delete %s with " +
                    "<strong>ID %d</strong> because there %s <strong>%d %s</strong> assigned " +
                    "to that %s", type.toLowerCase(), id, verbText, count, text, type.toLowerCase()));
        }
        return null;
    }

    public static <T> ResponseEntity<Object> updateAttribute(Long id, AttributeRequest data,
                                                             Supplier<Optional<T>> serviceGetter,
                                                             JpaRepository<T, Long> repository,
                                                             BiFunction<AttributeRequest, Optional<T>, T> updateFunction,
                                                             String type) {

        String name = data.getData().getName();
        String oldName = data.getData().getOldValue();
        try {
            Optional<T> existingOptional = serviceGetter.get();
            if (existingOptional.isEmpty()) {
                return ResponseUtils.notFoundResponse(String.format("%s with ID <strong>%d</strong> not found", type, id));
            }

            if (Objects.equals(name, oldName)) {
                return null;
            }

            if (ServiceUtils.existsByName(name, repository)) {
                return ResponseUtils.conflictResponse(String.format("%s named <strong>%s</strong> already exists", type, name));
            }

            T updatedEntity = updateFunction.apply(data, existingOptional);
            return ResponseUtils.successResponse(String.format("%s updated from <strong>%s</strong> to <strong>%s</strong> successfully", type, oldName, name), String.format("%s Update", type), Optional.of(updatedEntity));
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse(String.format("Failed to update %s with ID <strong>%d</strong>", type, id));
        }
    }

    // Common method for creating an attribute
    public static <T> ResponseEntity<Object> createAttribute(AttributeRequest data,
                                                             JpaRepository<T, Long> repository,
                                                             Supplier<T> newEntityFunction,
                                                             String type) {
        String name = data.getData().getName();
        try {
            if (ServiceUtils.existsByName(name, repository)) {
                return ResponseUtils.conflictResponse(String.format("%s named <strong>%s</strong> already exists", type, name));
            }

            T attribute = newEntityFunction.get();

            return ResponseUtils.createdResponse(String.format("%s named <strong>%s</strong> added successfully", type, name), String.format("%s Addition", type), Optional.ofNullable(attribute));
        } catch (Exception e) {
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

            if (countFunction != null) {
                ResponseEntity<Object> countResponse = getCountResponse(id, type, countFunction);
                if (countResponse != null) {
                    return countResponse;
                }
            }

            deleteFunction.apply(type, optional);
            return ResponseUtils.successResponse(String.format("%s with <strong>ID %d</strong> deleted successfully", type, id), String.format("%s Deletion", type), Optional.empty());
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse(String.format("Failed to delete %s with <strong>ID %d</strong>", type, id));
        }
    }

    private static ResponseEntity<Object> getCountResponse(Long id, String type, Function<Long, Long> countFunction) {
        if (Objects.equals(type, "Brand") || Objects.equals(type, "Category")) {
            return checkCount(id, type, countFunction, "product");
        }
        if (Objects.equals(type, "Attribute Type")) {
            return checkCount(id, type, countFunction, "attribute");
        }
        return null;
    }
}
