package dev.zunw.ecommerce.dto;

import dev.zunw.ecommerce.model.Banner;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateBannerRequest {
    private Banner data;
}
