package no.metatrack.api.service;

import no.metatrack.api.dto.CreateUserRequest;
import no.metatrack.api.dto.CreateUserResponse;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import no.metatrack.api.node.User;
import no.metatrack.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class AuthService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public CreateUserResponse registerNewUser(CreateUserRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new ResourceAlreadyExistsException("Email is already in use!");
		}

		String passwordHash = passwordEncoder.encode(request.password());
		User newUser = User.builder()
			.name(Optional.ofNullable(request.name()).filter(StringUtils::hasText).orElse(null))
			.email(request.email())
			.password(passwordEncoder.encode(request.password()))
			.build();

		User savedUser = userRepository.save(newUser);
		return new CreateUserResponse(savedUser.getId());
	}

	private boolean validatePassword(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}

}
