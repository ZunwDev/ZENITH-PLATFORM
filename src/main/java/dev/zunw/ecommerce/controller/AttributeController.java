package dev.zunw.ecommerce.controller;

import dev.zunw.ecommerce.dto.AttributeRequest;
import dev.zunw.ecommerce.model.Attribute;
import dev.zunw.ecommerce.repository.AttributeRepository;
import dev.zunw.ecommerce.service.AttributeService;
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
@RequestMapping("/api/attributes")
public class AttributeController {
    private final AttributeService attributeService;
    private final AttributeRepository attributeRepository;

    @Autowired
    AttributeController(AttributeService attributeService, AttributeRepository attributeRepository) {
        this.attributeService = attributeService;
        this.attributeRepository = attributeRepository;
    }

    @GetMapping("/{attributeTypeId}")
    public ResponseEntity<Object> getAttributesByAttributeTypeId(
            @PathVariable Long attributeTypeId) {
        return ResponseEntity.ok(attributeService.getByAttributeTypeId(attributeTypeId));
    }

    @GetMapping
    public ResponseEntity<Object> getAttributes() {
        return ResponseEntity.ok(getAllRows(attributeRepository));
    }

    @PutMapping("/{attributeId}")
    public ResponseEntity<Object> updateAnAttribute(@PathVariable Long attributeId,
                                                    @RequestBody AttributeRequest requestedData) {
        BiFunction<AttributeRequest, Optional<Attribute>, Attribute> updateFunction =
                (data, optionalAttribute) -> updateEntity(data, optionalAttribute,
                        attribute -> saveEntity(attribute, attributeRepository));
        return updateAttribute(attributeId, requestedData,
                () -> findRowById(attributeId, attributeRepository),
                attributeRepository,
                updateFunction,
                "Attribute");
    }

    @PostMapping
    public ResponseEntity<Object> newAttribute(@RequestBody AttributeRequest requestedData) {
        Supplier<Attribute> newFunction = () -> newEntity(requestedData, Attribute::new,
                attribute -> saveEntity(attribute, attributeRepository));
        return createAttribute(requestedData, attributeRepository, newFunction,
                "Attribute");
    }

    @DeleteMapping("/{attributeId}")
    public ResponseEntity<Object> deleteAnAttribute(@PathVariable Long attributeId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optionalCategory) -> {
                    ServiceUtils.deleteRowById(attributeId, attributeRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(attributeId,
                () -> findRowById(attributeId, attributeRepository),
                null,
                deleteFunction, "Attribute"
        );
    }
}
