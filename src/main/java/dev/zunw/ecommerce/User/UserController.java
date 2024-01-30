package dev.zunw.ecommerce.User;

import dev.zunw.ecommerce.UserCredentials.UserCredentials;
import dev.zunw.ecommerce.dto.CreateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERR: User not found");
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody CreateUserRequest createUserRequest) {
        User user = createUserRequest.getUser();
        UserCredentials credentials = createUserRequest.getCredentials();

        if (userService.userExists(user)) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "User already exists");
            errorResponse.put("errorCode", 409);
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
        try {
            User createdUser = userService.createUser(user, credentials);
            Map<String, Object> response = new HashMap<>();
            response.put("user", createdUser);
            response.put("message", "User created successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to create user");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/verify/{id}")
    public ResponseEntity<Map<String, Object>> verifyUser(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.getUserById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setVerified(true);
                userService.verifyUser(user);
            }
            Map<String, Object> response = new HashMap<>();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to verify user by email");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id) {
        User deletedUser = userService.deleteUser(id);
        return new ResponseEntity<>(deletedUser, HttpStatus.NO_CONTENT);
    }
}