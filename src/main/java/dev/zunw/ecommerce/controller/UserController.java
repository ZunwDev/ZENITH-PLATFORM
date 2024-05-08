package dev.zunw.ecommerce.controller;

import dev.zunw.ecommerce.dto.CreateUserRequest;
import dev.zunw.ecommerce.model.Session;
import dev.zunw.ecommerce.model.User;
import dev.zunw.ecommerce.model.UserCredentials;
import dev.zunw.ecommerce.repository.UserRepository;
import dev.zunw.ecommerce.service.UserService;
import dev.zunw.ecommerce.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

import static dev.zunw.ecommerce.utils.ServiceUtils.getAllRows;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Object> getAllUsers() {
        List<User> users = getAllRows(userRepository);
        if (users.isEmpty()) {
            return ResponseUtils.notFoundResponse("Users not found");
        } else {
            return ResponseUtils.successResponse(Optional.of(users));
        }
    }

    @GetMapping("/session/{id}")
    public ResponseEntity<Object> getSessionById(@PathVariable UUID id) {
        Optional<Session> sessionOptional = userService.getSessionById(id);
        if (sessionOptional.isPresent()) {
            Session session = sessionOptional.get();
            return ResponseEntity.ok(session);
        } else {
            return ResponseUtils.notFoundResponse("Session not found");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable UUID id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseUtils.successResponse(Optional.of(user));
        } else {
            return ResponseUtils.notFoundResponse("User not found");
        }
    }

    @GetMapping("/email")
    public ResponseEntity<Object> getUserByEmailAddress(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseUtils.badRequestResponse("Email parameter is missing");
        }

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseUtils.successResponse(Optional.of(user));
        } else {
            return ResponseUtils.notFoundResponse("User not found");
        }
    }

    @PostMapping("/check-login")
    public ResponseEntity<Object> checkUserLogin(@RequestBody Map<String, Object> requestBody) throws Exception {
        String email = (String) requestBody.get("email");
        String base64EncodedPassword = (String) requestBody.get("password");
        String isChecked = (String) requestBody.get("isChecked");

        byte[] decodedBytes = Base64.getDecoder().decode(base64EncodedPassword);
        String decodedString = new String(decodedBytes);

        LocalDateTime expirationTime = LocalDateTime.now();
        if (Boolean.parseBoolean(isChecked)) {
            expirationTime = expirationTime.plusDays(30);
        } else {
            expirationTime = expirationTime.plusHours(6);
        }

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseUtils.notFoundResponse("User not found");
        }

        User user = userOptional.get();
        Optional<UserCredentials> credentialsOptional = userService.getUserCredentialsById(user.getUserId());
        if (credentialsOptional.isEmpty()) {
            return ResponseUtils.unauthorizedResponse("Invalid credentials");
        }

        UserCredentials credentials = credentialsOptional.get();
        if (BCrypt.checkpw(decodedString, credentials.getPasswordHash())) {
            UUID sessionId = userService.createSession(user.getUserId(), user.getRoleId(), expirationTime, user.getFirstName());
            Map<String, Object> response = new HashMap<>();
            response.put("sessionToken", sessionId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseUtils.unauthorizedResponse("Invalid credentials");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createUser(@RequestBody CreateUserRequest createUserRequest) {
        User user = createUserRequest.getUser();
        UserCredentials credentials = createUserRequest.getCredentials();
        if (userService.userExists(user)) {
            return ResponseUtils.conflictResponse("User already exists");
        }
        try {
            User createdUser = userService.createUser(user, credentials);
            return ResponseUtils.createdResponse("User created successfully", "User Creation", Optional.ofNullable(createdUser));
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse("Failed to create user");
        }
    }

    @PutMapping("/verify/{id}")
    public ResponseEntity<Object> verifyUser(@PathVariable UUID id) {
        try {
            Optional<User> userOptional = userService.getUserById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setVerified(true);
                userService.verifyUser(user);
            }
            return ResponseUtils.successResponse("User was verified", "User Verify", null);
        } catch (Exception e) {
            return ResponseUtils.serverErrorResponse("Failed to verify user by email");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable UUID id) {
        User deletedUser = userService.deleteUser(id);
        return new ResponseEntity<>(deletedUser, HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/session/delete/{id}")
    public ResponseEntity<Object> deleteSession(@PathVariable UUID id) {
        userService.deleteSession(id);
        return ResponseUtils.noContentResponse("Session was deleted");
    }
}