package dev.zunw.ecommerce.dto;

import dev.zunw.ecommerce.Banner.Banner;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateBannerRequest {
    private Banner data;
}
