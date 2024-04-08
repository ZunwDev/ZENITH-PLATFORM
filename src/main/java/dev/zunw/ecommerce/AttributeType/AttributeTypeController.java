package dev.zunw.ecommerce.AttributeType;

import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.AttributeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Supplier;

import static dev.zunw.ecommerce.Attribute.AttributeUtils.*;
import static dev.zunw.ecommerce.ServiceUtils.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/attribute_types")
public class AttributeTypeController {
    private final AttributeTypeService attributeTypeService;
    private final AttributeTypeRepository attributeTypeRepository;

    @Autowired
    public AttributeTypeController(AttributeTypeService attributeTypeService, AttributeTypeRepository attributeTypeRepository) {
        this.attributeTypeService = attributeTypeService;
        this.attributeTypeRepository = attributeTypeRepository;
    }

    @GetMapping
    public ResponseEntity<Object> getAttributeTypes() {
        return ResponseEntity.ok(getAllEntities(attributeTypeRepository));
    }

    @PutMapping("/{attributeTypeId}")
    public ResponseEntity<Object> updateAnAttributeType(@PathVariable Long attributeTypeId,
                                                        @RequestBody AttributeRequest data) {
        BiFunction<String, Optional<AttributeType>, AttributeType> updateFunction =
                (name, optionalAttributeType) -> updateEntity(name, optionalAttributeType,
                        attribute -> saveEntity(attribute, attributeTypeRepository));
        return updateAttribute(attributeTypeId, data.getData().getName(),
                data.getData().getOldValue(),
                () -> findEntityById(attributeTypeId, attributeTypeRepository),
                attributeTypeRepository,
                updateFunction,
                "Attribute Type");
    }

    @PostMapping
    public ResponseEntity<Object> newAttributeType(@RequestBody AttributeRequest data) {
        String name = data.getData().getName();
        Supplier<AttributeType> newFunction = () -> newEntity(data, AttributeType::new,
                attribute -> saveEntity(attribute, attributeTypeRepository));
        return createAttribute(name, attributeTypeRepository, newFunction,
                "Attribute Type");
    }

    @DeleteMapping("/{attributeTypeId}")
    public ResponseEntity<Object> deleteAnAttributeType(@PathVariable Long attributeTypeId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optionalCategory) -> {
                    ServiceUtils.deleteEntityById(attributeTypeId, attributeTypeRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(attributeTypeId,
                () -> findEntityById(attributeTypeId, attributeTypeRepository),
                attributeTypeService::getAttributeCountByAttributeTypeId,
                deleteFunction, "Attribute Type"
        );
    }
}
