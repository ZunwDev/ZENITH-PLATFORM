package dev.zunw.ecommerce.Archived;

import dev.zunw.ecommerce.Product.Product;
import dev.zunw.ecommerce.Product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ArchivedService {
    private final ArchivedRepository archivedRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ArchivedService(ArchivedRepository archivedRepository, ProductRepository productRepository) {
        this.archivedRepository = archivedRepository;
        this.productRepository = productRepository;
    }

    public List<Archived> getAllProductArchived() {
        List<Archived> archived = archivedRepository.findAll();
        List<Product> products = productRepository.findAll();

        Map<Long, Integer> occurrences = new HashMap<>();
        for (Product product : products) {
            Long id = product.getArchived().getArchivedId();
            occurrences.put(id, occurrences.getOrDefault(id, 0) + 1);
        }
        for (Archived archives : archived) {
            Long archivedId = archives.getArchivedId();
            Integer occurrencesFinal = occurrences.getOrDefault(archivedId, 0);
            archives.setAmount(occurrencesFinal);
        }
        return archived;
    }
}
