package dev.zunw.ecommerce.controller;

import dev.zunw.ecommerce.dto.AttributeRequest;
import dev.zunw.ecommerce.model.AttributeType;
import dev.zunw.ecommerce.repository.AttributeTypeRepository;
import dev.zunw.ecommerce.service.AttributeTypeService;
import dev.zunw.ecommerce.utils.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Supplier;

import static dev.zunw.ecommerce.utils.AttributeUtils.*;
import static dev.zunw.ecommerce.utils.ServiceUtils.*;

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
        return ResponseEntity.ok(getAllRows(attributeTypeRepository));
    }

    @PutMapping("/{attributeTypeId}")
    public ResponseEntity<Object> updateAnAttributeType(@PathVariable Long attributeTypeId,
                                                        @RequestBody AttributeRequest requestedData) {
        BiFunction<AttributeRequest, Optional<AttributeType>, AttributeType> updateFunction =
                (data, optionalAttributeType) -> updateEntity(data, optionalAttributeType,
                        attribute -> saveEntity(attribute, attributeTypeRepository));
        return updateAttribute(attributeTypeId, requestedData,
                () -> findRowById(attributeTypeId, attributeTypeRepository),
                attributeTypeRepository,
                updateFunction,
                "Attribute Type");
    }

    @PostMapping
    public ResponseEntity<Object> newAttributeType(@RequestBody AttributeRequest requestedData) {
        Supplier<AttributeType> newFunction = () -> newEntity(requestedData, AttributeType::new,
                attribute -> saveEntity(attribute, attributeTypeRepository));
        return createAttribute(requestedData, attributeTypeRepository, newFunction,
                "Attribute Type");
    }

    @DeleteMapping("/{attributeTypeId}")
    public ResponseEntity<Object> deleteAnAttributeType(@PathVariable Long attributeTypeId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optionalCategory) -> {
                    ServiceUtils.deleteRowById(attributeTypeId, attributeTypeRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(attributeTypeId,
                () -> findRowById(attributeTypeId, attributeTypeRepository),
                attributeTypeService::getAttributeCountByAttributeTypeId,
                deleteFunction, "Attribute Type"
        );
    }
}
