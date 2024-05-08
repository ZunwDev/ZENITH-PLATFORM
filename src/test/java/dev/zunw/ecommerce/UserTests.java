package dev.zunw.ecommerce;

import dev.zunw.ecommerce.model.User;
import dev.zunw.ecommerce.repository.UserRepository;
import dev.zunw.ecommerce.service.UserService;
import dev.zunw.ecommerce.model.UserCredentials;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@Import(TestConfig.class)
public class UserTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    public void testCreateUser() {
        OffsetDateTime currentDateTime = OffsetDateTime.now(ZoneId.of("UTC"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssXXX");
        String formattedCurrentDateTime = currentDateTime.format(formatter);

        User newUser = new User();
        //newUser.setUsername("john_doe");
        newUser.setEmail("john.doe@example.com");
        //newUser.setUserRoleId(1);
        //newUser.setCreatedAt(formattedCurrentDateTime);

        UserCredentials newUserCredentials = new UserCredentials();
        newUserCredentials.setUserId(newUser.getUserId());
        newUserCredentials.setPasswordHash("4d2c041f49a5b9c48f2f5aa8e882344f4f52a2ff7f0a8a76a67a65d99d9b8185"); // random testing hash

        User createdUser = userService.createUser(newUser, newUserCredentials);

        assert createdUser != null : "User creation failed";
    }
}