package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateUserRequest;
import no.metatrack.api.dto.LoginRequest;
import no.metatrack.api.service.AuthService;
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

import java.util.Map;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

	private final RestTemplate restTemplate;

	private final String keycloakUrl;

	private final String keycloakRealm;

	private final String clientId;

	private final String clientSecret;

	private final AuthService authService;

	public AuthController(RestTemplate restTemplate, @Value("${keycloak.url}") String keycloakUrl,
			@Value("${keycloak.realm}") String keycloakRealm,
			@Value("${spring.security.oauth2.client.registration.keycloak.client-id}") String clientId,
			@Value("${spring.security.oauth2.client.registration.keycloak.client-secret}") String clientSecret,
			AuthService authService) {
		this.restTemplate = restTemplate;
		this.keycloakUrl = keycloakUrl;
		this.keycloakRealm = keycloakRealm;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerNewUser(@Valid @RequestBody CreateUserRequest request) {
		try {
			authService.registerNewUser(request.username(), request.email(), request.firstName(), request.lastName(),
					request.password());
			return ResponseEntity.status(HttpStatus.CREATED).build();
		}
		catch (HttpClientErrorException e) {
			return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
		}
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
