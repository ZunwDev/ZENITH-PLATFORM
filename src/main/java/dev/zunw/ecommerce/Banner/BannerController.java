package dev.zunw.ecommerce.Banner;

import dev.zunw.ecommerce.ResponseUtils;
import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.CreateBannerRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static dev.zunw.ecommerce.ServiceUtils.saveEntity;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;
    private final BannerRepository bannerRepository;

    @Autowired
    public BannerController(BannerService bannerService, BannerRepository bannerRepository) {
        this.bannerService = bannerService;
        this.bannerRepository = bannerRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createBanner(@RequestBody CreateBannerRequest requestBody) {
        Banner banner = requestBody.getData();
        if (ServiceUtils.existsByName(banner.getName(), bannerRepository)) {
            return ResponseUtils.conflictAlreadyExistsResponse("Banner", banner.getName());
        }
        try {
            Banner createdBanner = saveEntity(banner, bannerRepository);
            return ResponseUtils.createdResponse("Banner created successfully", "Banner Creation", Optional.of(createdBanner));
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse("Failed to create a banner");
        }
    }

    @GetMapping("/filteredData")
    public ResponseEntity<Object> getAllBanners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) List<String> position,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) List<String> aspectRatio,
            @RequestParam(required = false) String searchQuery
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        Map<String, Object> filteredData = bannerService.filterData(
                position, category, status, aspectRatio, pageable, searchQuery
        );
        if (filteredData.isEmpty()) {
            return ResponseUtils.notFoundResponse("No banners found with the given filters");
        } else {
            return ResponseUtils.successResponse(Optional.of(filteredData));
        }
    }

    @GetMapping()
    public ResponseEntity<Object> getFilteredBannerData(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) List<String> position,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) List<String> aspectRatio,
            @RequestParam(required = false) String searchQuery
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Banner> filteredData = bannerService.getFilteredBannerData(
                position, category, status, aspectRatio, pageable, searchQuery
        );
        if (filteredData.isEmpty()) {
            return ResponseUtils.notFoundResponse("No banners found with the given filters");
        } else {
            return ResponseUtils.successResponse(Optional.of(filteredData));
        }
    }
}
