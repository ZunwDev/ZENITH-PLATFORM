package dev.zunw.ecommerce.User;

import dev.zunw.ecommerce.Session.Session;
import dev.zunw.ecommerce.Session.SessionRepository;
import dev.zunw.ecommerce.UserCredentials.UserCredentials;
import dev.zunw.ecommerce.UserCredentials.UserCredentialsRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserCredentialsRepository userCredentialsRepository;
    private final SessionRepository sessionRepository;


    @Autowired
    public UserService(UserRepository userRepository, UserCredentialsRepository userCredentialsRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.userCredentialsRepository = userCredentialsRepository;
        this.sessionRepository = sessionRepository;
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<UserCredentials> getUserCredentialsById(UUID id) {
        return userCredentialsRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public Optional<Session> getSessionById(UUID id) {
        return sessionRepository.findById(id);
    }

    @Transactional
    public void verifyUser(User user) {
        userRepository.save(user);
    }

    @Transactional
    public Boolean userExists(User user) {
        Optional<User> existingUser = userRepository.findByEmailIgnoreCase(user.getEmail());
        return existingUser.isPresent();
    }

    @Transactional
    public User createUser(User user, UserCredentials credentials) {
        User savedUser = userRepository.save(user);
        credentials.setUserId(savedUser.getUserId());
        userCredentialsRepository.save(credentials);
        return savedUser;
    }

    @Transactional
    public UUID createSession(UUID userId, UUID roleId, LocalDateTime expirationTime, String firstName) {
        Session session = new Session();
        session.setUserId(userId);
        session.setRoleId(roleId);
        session.setExpirationTime(expirationTime);
        session.setFirstName(firstName);

        Dotenv dotenv = Dotenv.load();
        session.setRoleId(UUID.fromString(Objects.requireNonNull(dotenv.get("BASE_UUID_FOR_ADMIN_ROLE"))));
        session.setIsAdmin(session.getRoleId().equals(UUID.fromString(Objects.requireNonNull(dotenv.get("BASE_UUID_FOR_ADMIN_ROLE")))));

        sessionRepository.save(session);
        return session.getSessionId();
    }

    @Transactional
    public User deleteUser(UUID id) {
        userRepository.deleteById(id);
        return null;
    }

    @Transactional
    public void deleteSession(UUID id) {
        sessionRepository.deleteById(id);
    }
}