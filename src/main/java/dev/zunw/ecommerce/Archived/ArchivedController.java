package dev.zunw.ecommerce.Archived;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/archived")
public class ArchivedController {
    private final ArchivedService archivedService;

    @Autowired
    public ArchivedController(ArchivedService archivedService) {
        this.archivedService = archivedService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping()
    public ResponseEntity<Object> getProductArchived() {
        return ResponseEntity.ok(archivedService.getAllProductArchived());
    }
}
