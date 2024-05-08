package dev.zunw.ecommerce.service;

import dev.zunw.ecommerce.model.Brand;
import dev.zunw.ecommerce.model.Product;
import dev.zunw.ecommerce.repository.BrandRepository;
import dev.zunw.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static dev.zunw.ecommerce.utils.ServiceUtils.getAllRows;

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
        return getAllRows(brandRepository);
    }

    public long getBrandIdByName(String name) {
        return brandRepository.findIdByLowerName(name);
    }

    public List<Brand> getAllProductBrandsWithAmountGreaterThanZero() {
        List<Brand> brands = getAllRows(brandRepository);
        List<Product> products = getAllRows(productRepository);

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
                brandsWithAmountGreaterThanZero.add(brand);
            }
        }

        return brandsWithAmountGreaterThanZero;
    }
}
