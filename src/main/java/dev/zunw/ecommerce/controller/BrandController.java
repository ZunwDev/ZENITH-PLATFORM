package dev.zunw.ecommerce.controller;

import dev.zunw.ecommerce.dto.AttributeRequest;
import dev.zunw.ecommerce.model.Brand;
import dev.zunw.ecommerce.repository.BrandRepository;
import dev.zunw.ecommerce.service.BrandService;
import dev.zunw.ecommerce.service.ProductService;
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
@RequestMapping("/api/brands")
public class BrandController {
    private final BrandService brandService;
    private final ProductService productService;
    private final BrandRepository brandRepository;

    @Autowired
    public BrandController(BrandService brandService, ProductService productService, BrandRepository brandRepository) {
        this.brandService = brandService;
        this.productService = productService;
        this.brandRepository = brandRepository;
    }

    @GetMapping()
    public ResponseEntity<Object> getProductBrands() {
        return ResponseEntity.ok(brandService.getAllProductBrands());
    }

    @GetMapping("/{name}")
    public long getBrandIdByName(@PathVariable String name) {
        return brandService.getBrandIdByName(name);
    }

    @GetMapping("/nonzero")
    public ResponseEntity<Object> getProductBrandsNonZero() {
        return ResponseEntity.ok(brandService.getAllProductBrandsWithAmountGreaterThanZero());
    }

    @PutMapping("/{brandId}")
    public ResponseEntity<Object> updateBrand(@PathVariable Long brandId,
                                              @RequestBody AttributeRequest requestedData) {
        BiFunction<AttributeRequest, Optional<Brand>, Brand> updateFunction =
                (data, optionalBrand) -> updateEntity(data, optionalBrand,
                        brand -> saveEntity(brand, brandRepository));
        return updateAttribute(brandId, requestedData,
                () -> findRowById(brandId, brandRepository), brandRepository,
                updateFunction, "Brand");
    }

    @PostMapping
    public ResponseEntity<Object> newBrand(@RequestBody AttributeRequest requestedData) {
        Supplier<Brand> newFunction = () -> newEntity(requestedData,
                Brand::new, brand -> saveEntity(brand, brandRepository));
        return createAttribute(requestedData, brandRepository, newFunction,
                "Brand");
    }

    @DeleteMapping("/{brandId}")
    public ResponseEntity<Object> deleteBrand(@PathVariable Long brandId) {
        BiFunction<String, Optional<?>, Boolean> deleteFunction =
                (name, optionalCategory) -> {
                    ServiceUtils.deleteRowById(brandId, brandRepository);
                    return true; // Indicate successful deletion
                };
        return deleteAttribute(brandId,
                () -> findRowById(brandId, brandRepository),
                productService::getProductCountByBrandId,
                deleteFunction, "Brand"
        );
    }
}
