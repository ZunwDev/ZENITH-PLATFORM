package dev.zunw.ecommerce.controller;

import dev.zunw.ecommerce.dto.AttributeRequest;
import dev.zunw.ecommerce.model.ProductType;
import dev.zunw.ecommerce.repository.ProductTypeRepository;
import dev.zunw.ecommerce.service.ProductTypeService;
import dev.zunw.ecommerce.utils.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Supplier;

import static dev.zunw.ecommerce.utils.AttributeUtils.*;
import static dev.zunw.ecommerce.utils.ServiceUtils.findRowById;
import static dev.zunw.ecommerce.utils.ServiceUtils.saveEntity;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/product_types")
public class ProductTypeController {

    private final ProductTypeRepository productTypeRepository;
    private final ProductTypeService productTypeService;

    @Autowired
    public ProductTypeController(ProductTypeRepository productTypeRepository, ProductTypeService productTypeService) {
        this.productTypeRepository = productTypeRepository;
        this.productTypeService = productTypeService;
    }

    @GetMapping()
    public ResponseEntity<Object> getProductTypes() {
        return ResponseEntity.ok(productTypeService.getAllProductTypes());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Object> getProductTypeByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productTypeService.getProductTypeByCategoryId(categoryId));
    }

    @PutMapping("/{productTypeId}")
    public ResponseEntity<Object> updateProductType(@PathVariable Long productTypeId,
                                                    @RequestBody AttributeRequest requestedData) {
        BiFunction<AttributeRequest, Optional<ProductType>, ProductType> updateFunction =
                (data, optional) -> updateEntity(data, optional,
                        productType -> saveEntity(productType, productTypeRepository));
        return updateAttribute(productTypeId, requestedData,
                () -> findRowById(productTypeId, productTypeRepository), productTypeRepository,
                updateFunction, "Product Type");
    }

    @PostMapping
    public ResponseEntity<Object> newProductType(@RequestBody AttributeRequest requestedData) {
        Supplier<ProductType> newFunction = () -> newEntity(requestedData,
                ProductType::new, productType -> saveEntity(productType, productTypeRepository));
        return createAttribute(requestedData, productTypeRepository, newFunction,
                "Product Type");
    }

    @DeleteMapping("/{productTypeId}")
    public ResponseEntity<Object> deleteProductType(@PathVariable Long productTypeId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optional) -> {
                    ServiceUtils.deleteRowById(productTypeId, productTypeRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(productTypeId,
                () -> findRowById(productTypeId, productTypeRepository),
                null,
                deleteFunction, "Product Type"
        );
    }
}
