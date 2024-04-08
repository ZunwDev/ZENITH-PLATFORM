package dev.zunw.ecommerce.Attribute;

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
@RequestMapping("/api/attributes")
public class AttributeController {
    private final AttributeService attributeService;
    private final AttributeRepository attributeRepository;

    @Autowired
    AttributeController(AttributeService attributeService, AttributeRepository attributeRepository) {
        this.attributeService = attributeService;
        this.attributeRepository = attributeRepository;
    }

    @GetMapping("{attributeTypeId}")
    public ResponseEntity<Object> getAttributesByAttributeTypeId(
            @PathVariable Long attributeTypeId) {
        return ResponseEntity.ok(attributeService.getByAttributeTypeId(attributeTypeId));
    }

    @GetMapping("{attributeTypeId}/{categoryId}")
    public ResponseEntity<Object> getAttributesByCategoryIdAndAttributeTypeId(
            @PathVariable Long attributeTypeId, @PathVariable Long categoryId) {
        return ResponseEntity.ok(attributeService.getByCategoryIdAndAttributeTypeId(categoryId, attributeTypeId));
    }

    @GetMapping
    public ResponseEntity<Object> getAttributes() {
        return ResponseEntity.ok(getAllEntities(attributeRepository));
    }

    @PutMapping("/{attributeId}")
    public ResponseEntity<Object> updateAnAttribute(@PathVariable Long attributeId,
                                                    @RequestBody AttributeRequest data) {
        BiFunction<String, Optional<Attribute>, Attribute> updateFunction =
                (name, optionalAttribute) -> updateEntity(name, optionalAttribute,
                        attribute -> saveEntity(attribute, attributeRepository));
        return updateAttribute(attributeId, data.getData().getName(), data.getData().getOldValue(),
                () -> findEntityById(attributeId, attributeRepository),
                attributeRepository,
                updateFunction,
                "Attribute");
    }

    @PostMapping
    public ResponseEntity<Object> newAttribute(@RequestBody AttributeRequest data) {
        String name = data.getData().getName();
        Supplier<Attribute> newFunction = () -> newEntity(data, Attribute::new,
                attribute -> saveEntity(attribute, attributeRepository));
        return createAttribute(name, attributeRepository, newFunction,
                "Attribute");
    }

    @DeleteMapping("/{attributeId}")
    public ResponseEntity<Object> deleteAnAttribute(@PathVariable Long attributeId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optionalCategory) -> {
                    ServiceUtils.deleteEntityById(attributeId, attributeRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(attributeId,
                () -> findEntityById(attributeId, attributeRepository),
                null,
                deleteFunction, "Attribute"
        );
    }
}
