package dev.zunw.ecommerce.User;

import dev.zunw.ecommerce.UserCredentials.UserCredentials;
import dev.zunw.ecommerce.UserCredentials.UserCredentialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserCredentialsRepository userCredentialsRepository;

    @Autowired
    public UserService(UserRepository userRepository, UserCredentialsRepository userCredentialsRepository) {
        this.userRepository = userRepository;
        this.userCredentialsRepository = userCredentialsRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<UserCredentials> getUserCredentialsById(Long id) {
        return userCredentialsRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
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
    public User deleteUser(Long id) {
        userRepository.deleteById(id);
        return null;
    }
}