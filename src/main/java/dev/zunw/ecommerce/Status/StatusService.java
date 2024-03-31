package dev.zunw.ecommerce.Status;

import dev.zunw.ecommerce.Product.Product;
import dev.zunw.ecommerce.Product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatusService {
    private final StatusRepository statusRepository;
    private final ProductRepository productRepository;

    @Autowired
    public StatusService(StatusRepository statusRepository, ProductRepository productRepository) {
        this.statusRepository = statusRepository;
        this.productRepository = productRepository;
    }

    public List<Status> getAllProductStatuses() {
        List<Status> status = statusRepository.findAll();
        List<Product> products = productRepository.findAll();

        Map<Long, Integer> occurrences = new HashMap<>();
        for (Product product : products) {
            Long id = product.getStatus().getStatusId();
            occurrences.put(id, occurrences.getOrDefault(id, 0) + 1);
        }
        for (Status statuses : status) {
            Long statusId = statuses.getStatusId();
            Integer occurrencesFinal = occurrences.getOrDefault(statusId, 0);
            statuses.setAmount(occurrencesFinal);
        }
        return status;
    }
}
