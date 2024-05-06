package dev.zunw.ecommerce.Product;

import dev.zunw.ecommerce.ResponseUtils;
import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.CreateProductRequest;
import dev.zunw.ecommerce.dto.ProductTypeCount;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static dev.zunw.ecommerce.ServiceUtils.findRowById;
import static dev.zunw.ecommerce.ServiceUtils.saveEntity;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductService productService, ProductRepository productRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
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
            existingProduct.setStatus(updatedProductData.getStatus());
            return existingProduct;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<Object> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) List<Long> brand,
            @RequestParam(required = false) List<Long> category,
            @RequestParam(required = false) List<Long> status,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "descending") String sortDirection,
            @RequestParam(required = false) String searchQuery
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Product> products = productService.findByFilters(category, brand, status, pageable, sortBy, sortDirection, searchQuery);

        if (products.isEmpty()) {
            return ResponseUtils.notFoundResponse("No products found");
        } else {
            return ResponseUtils.successResponse(Optional.of(products));
        }
    }

    @GetMapping("/amounts")
    public ResponseEntity<Object> getAllProductAmounts(@RequestParam(required = false) Long[] brand,
                                                       @RequestParam(required = false) Long[] category,
                                                       @RequestParam(required = false) Long[] status) {
        Map<String, List<Map<String, Object>>> products = productService.getFilterCounts(category, brand, status);
        if (products.isEmpty()) {
            return ResponseUtils.notFoundResponse("No products found");
        } else {
            return ResponseUtils.successResponse(Optional.of(products));
        }
    }

    @GetMapping("/type-counts")
    public ResponseEntity<Object> getProductTypeCounts() {
        Map<String, List<ProductTypeCount>> typeCounts = productService.getProductTypeCountsByCategory();
        return ResponseUtils.successResponse(Optional.of(typeCounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable UUID id) {
        Optional<Product> productOptional = productService.getProductById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            return ResponseUtils.successResponse(Optional.of(product));
        } else {
            return ResponseUtils.notFoundResponse("Product not found");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createProduct(@RequestBody CreateProductRequest requestBody) {
        Product product = requestBody.getProduct();
        if (ServiceUtils.existsByName(product.getName(), productRepository)) {
            return ResponseUtils.conflictAlreadyExistsResponse("Product", product.getName());
        }
        try {
            Product createdProduct = saveEntity(product, productRepository);
            return ResponseUtils.createdResponse("Product created successfully", "Product Creation", Optional.of(createdProduct));
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse("Failed to create product");
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Object> updateProduct(@PathVariable UUID productId, @RequestBody CreateProductRequest updatedProductData) {
        try {
            Optional<Product> existingProductOptional = findRowById(productId, productRepository);
            if (existingProductOptional.isPresent()) {
                Product existingProduct = getExistingProduct(updatedProductData.getProduct(), existingProductOptional);
                Product updatedProduct = saveEntity(existingProduct, productRepository);
                return ResponseUtils.successResponse("Product updated successfully", "Product Update", Optional.of(updatedProduct));
            } else {
                return ResponseUtils.notFoundResponse("Product not found");
            }
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse("Failed to update product");
        }
    }
}

