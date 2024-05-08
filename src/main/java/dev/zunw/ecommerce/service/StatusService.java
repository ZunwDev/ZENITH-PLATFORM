package dev.zunw.ecommerce.service;

import dev.zunw.ecommerce.model.Status;
import dev.zunw.ecommerce.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static dev.zunw.ecommerce.utils.ServiceUtils.getAllRows;

@Service
public class StatusService {
    private final StatusRepository statusRepository;

    @Autowired
    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    public List<Status> getAllProductStatuses() {
        return getAllRows(statusRepository);
    }

    public Optional<Status> getStatusIdByName(String name) {
        return statusRepository.findByLowerName(name);
    }

    public Optional<Status> getStatusById(Long id) {
        return statusRepository.findById(id);
    }
}
