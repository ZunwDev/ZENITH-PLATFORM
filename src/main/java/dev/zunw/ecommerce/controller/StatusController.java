package dev.zunw.ecommerce.controller;

import dev.zunw.ecommerce.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/status")
public class StatusController {
    private final StatusService statusService;

    @Autowired
    public StatusController(StatusService statusService) {
        this.statusService = statusService;
    }

    @GetMapping()
    public ResponseEntity<Object> getProductStatus() {
        return ResponseEntity.ok(statusService.getAllProductStatuses());
    }

//    @GetMapping("/{name}")
//    public long getStatusIdByName(@PathVariable String name) {
//        return statusService.getStatusIdByName(name);
//    }

    @GetMapping("/{name}")
    public ResponseEntity<Object> getStatusById(@PathVariable String name) {
        return ResponseEntity.ok(statusService.getStatusIdByName(name));
    }
}
