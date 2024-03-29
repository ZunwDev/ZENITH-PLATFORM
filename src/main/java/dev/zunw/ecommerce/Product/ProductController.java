package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.dto.CreateProductRequest;
import org.jetbrains.annotations.NotNull;
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
            @RequestParam(required = false) List<Long> brand,
            @RequestParam(required = false) List<Long> category,
            @RequestParam(required = false) List<Long> archived,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) String searchQuery
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Product> products = productService.findByFilters(category, brand, archived, pageable, sortBy, sortDirection, searchQuery);

        if (products.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No products found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.ok(products);
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/amounts")
    public ResponseEntity<Object> getAllProductAmounts(@RequestParam(required = false) Long[] brand,
                                                       @RequestParam(required = false) Long[] category,
                                                       @RequestParam(required = false) Long[] archived) {
        Map<String, List<Map<String, Object>>> products = productService.getFilterCounts(category, brand, archived);
        if (products.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No products found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.ok(products);
        }
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

    @CrossOrigin(origins = "*")
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody CreateProductRequest requestBody) {
        Product product = requestBody.getProduct();
        if (productService.productExists(product)) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Product already exists");
            errorResponse.put("errorCode", 409);
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
        try {
            Product createdProduct = productService.createProduct(product);
            Map<String, Object> response = new HashMap<>();
            response.put("product", createdProduct);
            response.put("message", "Product created successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to create product");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable UUID productId, @RequestBody CreateProductRequest updatedProductData) {
        try {
            Optional<Product> existingProductOptional = productService.getProductById(productId);
            if (existingProductOptional.isPresent()) {
                Product existingProduct = getExistingProduct(updatedProductData.getProduct(), existingProductOptional);
                Product updatedProduct = productService.updateProduct(existingProduct);

                Map<String, Object> response = new HashMap<>();
                response.put("product", updatedProduct);
                response.put("message", "Product updated successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Product not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update product");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @NotNull
    private static Product getExistingProduct(Product updatedProductData, Optional<Product> existingProductOptional) {
        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();
            existingProduct.setName(updatedProductData.getName());
            existingProduct.setDescription(updatedProductData.getDescription());
            existingProduct.setPrice(updatedProductData.getPrice());
            existingProduct.setSpecifications(updatedProductData.getSpecifications());
            existingProduct.setQuantity(updatedProductData.getQuantity());
            existingProduct.setDiscount(updatedProductData.getDiscount());
            existingProduct.setBrand(updatedProductData.getBrand());
            existingProduct.setCategory(updatedProductData.getCategory());
            existingProduct.setArchived(updatedProductData.getArchived());
            return existingProduct;
        }
        return null;
    }
}

