package no.metatrack.api.service;

import no.metatrack.api.node.User;
import no.metatrack.api.repository.UserRepository;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class AuthService {

	private final RestTemplate restTemplate;

	private final String keycloakUrl;

	private final String keycloakRealm;

	private final String clientId;

	private final String clientSecret;

	private final UserRepository userRepository;

	public AuthService(RestTemplate restTemplate, @Value("${keycloak.url}") String keycloakUrl,
			@Value("${keycloak.realm}") String keycloakRealm,
			@Value("${spring.security.oauth2.client.registration.keycloak.client-id}") String clientId,
			@Value("${spring.security.oauth2.client.registration.keycloak.client-secret}") String clientSecret,
			UserRepository userRepository) {
		this.restTemplate = restTemplate;
		this.keycloakUrl = keycloakUrl;
		this.keycloakRealm = keycloakRealm;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.userRepository = userRepository;
	}

	public void registerNewUser(String username, String email, String firstName, String lastName, String password) {
		String url = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(getAdminToken());

		UserRepresentation userRepresentation = new UserRepresentation();
		userRepresentation.setUsername(username);
		userRepresentation.setEmail(email);
		userRepresentation.setFirstName(firstName);
		userRepresentation.setLastName(lastName);
		userRepresentation.setEnabled(true);

		CredentialRepresentation credentials = new CredentialRepresentation();
		credentials.setType(CredentialRepresentation.PASSWORD);
		credentials.setValue(password);
		credentials.setTemporary(false);

		userRepresentation.setCredentials(List.of(credentials));

		HttpEntity<UserRepresentation> entity = new HttpEntity<>(userRepresentation, headers);

		ResponseEntity<String> keycloakResponse = restTemplate.postForEntity(url, entity, String.class);
		if (keycloakResponse.getStatusCode().is2xxSuccessful()) {
			String location = Objects.requireNonNull(keycloakResponse.getHeaders().getLocation()).toString();
			String userIdFromKeycloak = location.substring(location.lastIndexOf("/") + 1);

			User newUser = new User(userIdFromKeycloak);
			userRepository.save(newUser);
		}

	}

	public Optional<UserRepresentation> getUserDetails(String userId) {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(getAdminToken());
		HttpEntity<Void> entity = new HttpEntity<>(headers);

		ResponseEntity<UserRepresentation> response = restTemplate.exchange(
				keycloakUrl + "/admin/realms/" + keycloakRealm + "/users/" + userId, HttpMethod.GET, entity,
				UserRepresentation.class);

		if (response.getStatusCode().is2xxSuccessful()) {
			return Optional.ofNullable(response.getBody());
		}
		return Optional.empty();
	}

	private String getAdminToken() throws IllegalStateException {
		String url = keycloakUrl + "/realms/" + keycloakRealm + "/protocol/openid-connect/token";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("grant_type", "client_credentials");
		map.add("client_id", clientId);
		map.add("client_secret", clientSecret);

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

		try {

			ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

			if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
				return (String) response.getBody().get("access_token");
			}
			throw new IllegalStateException("Failed to retrieve admin token: " + response.getStatusCode());
		}
		catch (Exception e) {
			throw new IllegalStateException("Failed to retrieve admin token", e);
		}
	}

}
