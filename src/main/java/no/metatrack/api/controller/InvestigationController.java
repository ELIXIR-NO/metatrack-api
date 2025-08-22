package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateInvestigationRequest;
import no.metatrack.api.dto.InvestigationResponse;
import no.metatrack.api.dto.UpdateInvestigationRequest;
import no.metatrack.api.service.InvestigationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/investigations")
public class InvestigationController {

	private final InvestigationService investigationService;

	public InvestigationController(InvestigationService investigationService) {
		this.investigationService = investigationService;
	}

	@PostMapping
	public ResponseEntity<InvestigationResponse> createInvestigation(
			@Valid @RequestBody CreateInvestigationRequest request, @AuthenticationPrincipal Jwt jwt) {

		InvestigationResponse response = investigationService.createInvestigation(request, jwt.getSubject());

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{id}")
			.buildAndExpand(response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

	@GetMapping
	public ResponseEntity<List<InvestigationResponse>> getAllInvestigations() {
		List<InvestigationResponse> response = investigationService.getAllInvestigations();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{investigationId}")
	public ResponseEntity<InvestigationResponse> getInvestigationById(@PathVariable String investigationId) {
		InvestigationResponse investigation = investigationService.getInvestigationById(investigationId);
		return ResponseEntity.ok(investigation);
	}

	@PutMapping("/{investigationId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).ADMIN)")
	public ResponseEntity<InvestigationResponse> updateInvestigation(@PathVariable String investigationId,
			@Valid @RequestBody UpdateInvestigationRequest request) {
		InvestigationResponse investigation = investigationService.updateInvestigation(request, investigationId);
		return ResponseEntity.ok(investigation);
	}

}
