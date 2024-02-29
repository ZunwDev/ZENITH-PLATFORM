package dev.zunw.ecommerce.Brand;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brands")
public class BrandController {
    private final BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping()
    public ResponseEntity<Object> getProductBrands() {
        return ResponseEntity.ok(brandService.getAllProductBrands());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/nonzero")
    public ResponseEntity<Object> getProductBrandsNonZero() {return ResponseEntity.ok(brandService.getAllProductBrandsWithAmountGreaterThanZero());}
}
