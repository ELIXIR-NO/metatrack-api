package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateInvestigationRequest;
import no.metatrack.api.dto.InvestigationResponse;
import no.metatrack.api.service.InvestigationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping(value = "/api/v1/investigations", consumes = MediaType.APPLICATION_JSON_VALUE,
		produces = MediaType.APPLICATION_JSON_VALUE)
public class InvestigationController {

	private final InvestigationService investigationService;

	public InvestigationController(InvestigationService investigationService) {
		this.investigationService = investigationService;
	}

	@PostMapping
	public ResponseEntity<InvestigationResponse> createInvestigation(
			@Valid @RequestBody CreateInvestigationRequest request) {

		// NB! Replace it with the actual logged-in user's email
		var userEmail = "john.doe@example.com";

		InvestigationResponse response = investigationService.createInvestigation(request, userEmail);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{id}")
			.buildAndExpand(response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

}
