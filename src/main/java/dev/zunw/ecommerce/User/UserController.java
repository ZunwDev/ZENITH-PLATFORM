package dev.zunw.ecommerce.User;

import dev.zunw.ecommerce.Session.Session;
import dev.zunw.ecommerce.UserCredentials.UserCredentials;
import dev.zunw.ecommerce.dto.CreateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(users);
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/session/{id}")
    public ResponseEntity<Object> getSessionById(@PathVariable UUID id) {
        Optional<Session> sessionOptional = userService.getSessionById(id);
        if (sessionOptional.isPresent()) {
            Session session = sessionOptional.get();
            return ResponseEntity.ok(session);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERR: Session not found");
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable UUID id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERR: User not found");
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/email")
    public ResponseEntity<Object> getUserByEmailAddress(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ERR: Email parameter is missing");
        }

        Optional<User> userOptional = userService.getUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERR: User not found");
        }
    }

    @CrossOrigin(origins = "*")
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERR: User not found");
        }

        User user = userOptional.get();
        Optional<UserCredentials> credentialsOptional = userService.getUserCredentialsById(user.getUserId());
        if (credentialsOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ERR: Invalid credentials");
        }

        UserCredentials credentials = credentialsOptional.get();
        if (BCrypt.checkpw(decodedString, credentials.getPasswordHash())) {
            UUID sessionId = userService.createSession(user.getUserId(), user.getRoleId(), expirationTime, user.getFirstName());
            Map<String, Object> response = new HashMap<>();
            response.put("sessionToken", sessionId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ERR: Invalid credentials");
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
    public ResponseEntity<Map<String, Object>> verifyUser(@PathVariable UUID id) {
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

    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable UUID id) {
        User deletedUser = userService.deleteUser(id);
        return new ResponseEntity<>(deletedUser, HttpStatus.NO_CONTENT);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/session/delete/{id}")
    public ResponseEntity<Object> deleteSession(@PathVariable UUID id) {
        userService.deleteSession(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Deleted a session");
    }
}