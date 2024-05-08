package dev.zunw.ecommerce.dto;

import dev.zunw.ecommerce.model.User;
import dev.zunw.ecommerce.model.UserCredentials;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateUserRequest {
    private User user;
    private UserCredentials credentials;
}
