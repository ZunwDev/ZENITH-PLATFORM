package dev.zunw.ecommerce.Banner;

import dev.zunw.ecommerce.ResponseUtils;
import dev.zunw.ecommerce.ServiceUtils;
import dev.zunw.ecommerce.dto.CreateBannerRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
