package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateUserRequest;
import no.metatrack.api.dto.LoginRequest;
import no.metatrack.api.node.User;
import no.metatrack.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

	private final RestTemplate restTemplate;

	private final String keycloakUrl;

	private final String keycloakRealm;

	private final String clientId;

	private final String clientSecret;

	private final String adminUsername;

	private final String adminPassword;

	private final UserRepository userRepository;

	public AuthController(RestTemplate restTemplate, @Value("${keycloak.url}") String keycloakUrl,
			@Value("${keycloak.realm}") String keycloakRealm, @Value("${keycloak.admin-username}") String adminUsername,
			@Value("${keycloak.admin-password}") String adminPassword,
			@Value("${spring.security.oauth2.client.registration.keycloak.client-id}") String clientId,
			@Value("${spring.security.oauth2.client.registration.keycloak.client-secret}") String clientSecret,
			UserRepository userRepository) {
		this.restTemplate = restTemplate;
		this.keycloakUrl = keycloakUrl;
		this.keycloakRealm = keycloakRealm;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.adminUsername = adminUsername;
		this.adminPassword = adminPassword;
		this.userRepository = userRepository;
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerNewUser(@Valid @RequestBody CreateUserRequest request) {
		String url = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users";

		String adminToken = getAdminToken();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(adminToken);

		Map<String, Object> userRepresentation = new HashMap<>();
		userRepresentation.put("username", request.username());
		userRepresentation.put("email", request.email());
		userRepresentation.put("firstName", request.firstName());
		userRepresentation.put("lastName", request.lastName());
		userRepresentation.put("enabled", true);

		Map<String, Object> credentials = new HashMap<>();
		credentials.put("type", "password");
		credentials.put("value", request.password());
		credentials.put("temporary", false);
		userRepresentation.put("credentials", List.of(credentials));

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(userRepresentation, headers);

		try {
			ResponseEntity<String> keycloakResponse = restTemplate.postForEntity(url, entity, String.class);
			if (keycloakResponse.getStatusCode().is2xxSuccessful()) {
				String location = Objects.requireNonNull(keycloakResponse.getHeaders().getLocation()).toString();
				String userId = location.substring(location.lastIndexOf("/") + 1);

				User newUser = new User(userId);
				userRepository.save(newUser);

				return ResponseEntity.status(HttpStatus.CREATED).build();
			}
		}
		catch (HttpClientErrorException e) {
			return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
		}
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	}

	private String getAdminToken() {
		String url = keycloakUrl + "/realms/master/protocol/openid-connect/token";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("grant_type", "password");
		map.add("client_id", "admin-cli");
		map.add("username", adminUsername);
		map.add("password", adminPassword);

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
		ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
		return (String) response.getBody().get("access_token");

	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
		String url = keycloakUrl + "/realms/" + keycloakRealm + "/protocol/openid-connect/token";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("grant_type", "password");
		map.add("client_id", clientId);
		map.add("client_secret", clientSecret);
		map.add("username", request.username());
		map.add("password", request.password());

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

		try {
			return restTemplate.postForEntity(url, entity, String.class);
		}
		catch (HttpClientErrorException e) {
			return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> request) {
		String url = keycloakUrl + "/realms/" + keycloakRealm + "/protocol/openid-connect/logout";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("client_id", clientId);
		map.add("client_secret", clientSecret);
		map.add("refresh_token", request.get("refresh_token"));

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

		try {
			return restTemplate.postForEntity(url, entity, String.class);
		}
		catch (HttpClientErrorException e) {
			return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
		}
	}

}
