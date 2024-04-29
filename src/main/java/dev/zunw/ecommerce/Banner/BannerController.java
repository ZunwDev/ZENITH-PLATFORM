package dev.zunw.ecommerce.Banner;

import dev.zunw.ecommerce.ResponseUtils;
import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.CreateBannerRequest;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static dev.zunw.ecommerce.ServiceUtils.findRowById;
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

    @NotNull
    private static Banner getExistingBanner(Banner updatedBannerData,
                                            Optional<Banner> existingBannerOptional) {
        if (existingBannerOptional.isPresent()) {
            Banner existingItem = existingBannerOptional.get();
            existingItem.setName(updatedBannerData.getName());
            existingItem.setCategory(updatedBannerData.getCategory());
            existingItem.setStatus(updatedBannerData.getStatus());
            existingItem.setLink(updatedBannerData.getLink());
            existingItem.setActivationDate(updatedBannerData.getActivationDate());
            existingItem.setExpirationDate(updatedBannerData.getExpirationDate());
            existingItem.setAspectRatio(updatedBannerData.getAspectRatio());
            existingItem.setIncludeButton(updatedBannerData.getIncludeButton());
            existingItem.setPosition(updatedBannerData.getPosition());
            return existingItem;
        }
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getBannerById(@PathVariable UUID id) {
        Optional<Banner> bannerOptional = bannerService.getBannerById(id);
        if (bannerOptional.isPresent()) {
            Banner product = bannerOptional.get();
            return ResponseUtils.successResponse(Optional.of(product));
        } else {
            return ResponseUtils.notFoundResponse("Product not found");
        }
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

    @PutMapping("/{bannerId}")
    public ResponseEntity<Object> updateBanner(@PathVariable UUID bannerId,
                                               @RequestBody CreateBannerRequest updatedBannerData) {
        try {
            Optional<Banner> existingProductOptional = findRowById(bannerId, bannerRepository);
            if (existingProductOptional.isPresent()) {
                Banner existingBanner = getExistingBanner(updatedBannerData.getData(),
                        existingProductOptional);
                Banner updatedBanner = saveEntity(existingBanner, bannerRepository);
                return ResponseUtils.successResponse("Banner updated successfully", "Banner " +
                        "Update", Optional.of(updatedBanner));
            } else {
                return ResponseUtils.notFoundResponse("Banner not found");
            }
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse("Failed to update banner");
        }
    }
}
