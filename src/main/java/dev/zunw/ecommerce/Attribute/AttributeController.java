package dev.zunw.ecommerce.Attribute;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/attribute")
public class AttributeController {
    private final AttributeService attributeService;

    @Autowired
    AttributeController(AttributeService attributeService) {
        this.attributeService = attributeService;
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
}
