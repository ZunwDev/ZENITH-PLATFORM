package dev.zunw.ecommerce.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private List<Boolean> finalArchived;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping
    public ResponseEntity<Object> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) List<Long> brands,
            @RequestParam(required = false) List<Long> categories,
            @RequestParam(required = false) List<String> archived
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        List<Boolean> finalArchived = getFinalArchived(archived);
        Page<Product> products = productService.findByFilters(categories, brands, finalArchived, pageable);

        if (products.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No products found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.ok(products);
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/category")
    public ResponseEntity<Object> getProductCategories() {
        return ResponseEntity.ok(productService.getAllProductCategories());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/brand")
    public ResponseEntity<Object> getProductBrands() {
        return ResponseEntity.ok(productService.getAllProductBrands());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable UUID id) {
        Optional<Product> productOptional = productService.getProductById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }
    private List<Boolean> getFinalArchived(List<String> archived) {
        List<Boolean> finalArchived = new ArrayList<>();
        if (archived != null) {
            if (archived.contains("active") && archived.contains("archived")) {
                finalArchived.add(true);
                finalArchived.add(false);
            } else if (archived.contains("archived")) {
                finalArchived.add(true);
            }
        }
        return finalArchived;
    }
}

