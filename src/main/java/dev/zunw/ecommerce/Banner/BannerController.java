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
            System.out.println(banner.getCategory());
            return ResponseUtils.serverErrorResponse("Failed to create a banner");
        }
    }

    @GetMapping
    public ResponseEntity<Object> getAllBanners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) List<Long> category,
            @RequestParam(required = false) List<Long> status,
            @RequestParam(required = false) String searchQuery
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Banner> banners = bannerService.findByFilters(category, status, pageable,
                searchQuery);

        if (banners.isEmpty()) {
            return ResponseUtils.notFoundResponse("No banners found");
        } else {
            return ResponseUtils.successResponse(Optional.of(banners));
        }
    }
}
