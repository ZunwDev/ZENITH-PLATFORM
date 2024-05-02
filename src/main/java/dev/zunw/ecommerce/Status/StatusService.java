package dev.zunw.ecommerce.Status;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static dev.zunw.ecommerce.ServiceUtils.getAllRows;

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

    public long getStatusIdByName(String name) {return statusRepository.findIdByLowerName(name);}
}
