package no.metatrack.api.controller;

import no.metatrack.api.dto.InvestigationResponse;
import no.metatrack.api.service.AuthService;
import no.metatrack.api.service.UserService;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/me")
public class UserController {

	private final UserService userService;

	private final AuthService authService;

	public UserController(UserService userService, AuthService authService) {
		this.userService = userService;
		this.authService = authService;
	}

	@GetMapping
	public UserRepresentation getUserDetails(@AuthenticationPrincipal Jwt jwt) {
		String userId = jwt.getSubject();

		Optional<UserRepresentation> userDetails = authService.getUserDetails(userId);

		return userDetails.orElseThrow();
	}

	@GetMapping("/investigations")
	public List<InvestigationResponse> getInvestigationsForUser(@AuthenticationPrincipal Jwt jwt) {
		String userId = jwt.getSubject();

		return userService.getAllInvestigations(userId);
	}

}
