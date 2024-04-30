package dev.zunw.ecommerce.ProductType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static dev.zunw.ecommerce.ServiceUtils.getAllRows;

@Service
public class ProductTypeService {
    private final ProductTypeRepository productTypeRepository;

    @Autowired
    public ProductTypeService(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    public List<ProductType> getAllProductTypes() {
        return getAllRows(productTypeRepository);
    }

    public List<String> getProductTypeByCategoryId(Long id) {
        List<ProductType> productTypes = productTypeRepository.findByCategoryId(id);
        List<String> productTypeNames = new ArrayList<>();
        for (ProductType productType : productTypes) {
            productTypeNames.add(productType.getName());
        }
        return productTypeNames;
    }
}
