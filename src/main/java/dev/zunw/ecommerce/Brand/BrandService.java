package dev.zunw.ecommerce.Brand;

import dev.zunw.ecommerce.Product.Product;
import dev.zunw.ecommerce.Product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BrandService {
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    @Autowired
    public BrandService(BrandRepository brandRepository, ProductRepository productRepository) {
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
    }

    public List<Brand> getAllProductBrands() {
        List<Brand> brands = brandRepository.findAll();
        List<Product> products = productRepository.findAll();

        Map<Long, Integer> occurrences = new HashMap<>();
        for (Product product : products) {
            Long id = product.getBrand().getBrandId();
            occurrences.put(id, occurrences.getOrDefault(id, 0) + 1);
        }
        for (Brand brand : brands) {
            Long brandId = brand.getBrandId();
            Integer occurrencesFinal = occurrences.getOrDefault(brandId, 0);
            brand.setAmount(occurrencesFinal);
        }

        return brands;
    }

    public List<Brand> getAllProductBrandsWithAmountGreaterThanZero() {
        List<Brand> brands = brandRepository.findAll();
        List<Product> products = productRepository.findAll();

        Map<Long, Integer> occurrences = new HashMap<>();
        for (Product product : products) {
            Long id = product.getBrand().getBrandId();
            occurrences.put(id, occurrences.getOrDefault(id, 0) + 1);
        }

        // Filter out brands with amount greater than 0
        List<Brand> brandsWithAmountGreaterThanZero = new ArrayList<>();
        for (Brand brand : brands) {
            Long brandId = brand.getBrandId();
            Integer occurrencesFinal = occurrences.getOrDefault(brandId, 0);
            if (occurrencesFinal > 0) {
                brand.setAmount(occurrencesFinal);
                brandsWithAmountGreaterThanZero.add(brand);
            }
        }

        return brandsWithAmountGreaterThanZero;
    }
}
