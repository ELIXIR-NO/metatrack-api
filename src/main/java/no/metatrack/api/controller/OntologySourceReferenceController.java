package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologySourceReferenceRequest;
import no.metatrack.api.dto.OntologySourceReferenceResponse;
import no.metatrack.api.dto.UpdateOntologySourceReferenceRequest;
import no.metatrack.api.service.OntologySourceReferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/investigations/{investigationId}/ontology/sources")
public class OntologySourceReferenceController {

	private final OntologySourceReferenceService ontologySourceReferenceService;

	public OntologySourceReferenceController(OntologySourceReferenceService ontologySourceReferenceService) {
		this.ontologySourceReferenceService = ontologySourceReferenceService;
	}

	@PostMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<OntologySourceReferenceResponse> createOntologySourceReference(
			@PathVariable String investigationId, @Valid @RequestBody CreateOntologySourceReferenceRequest request) {
		OntologySourceReferenceResponse response = ontologySourceReferenceService
			.createNewOntologySourceReference(investigationId, request);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigation/{investigationId}/ontology/source/{id}")
			.buildAndExpand(investigationId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

	@GetMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<List<OntologySourceReferenceResponse>> getAllOntologySourceReferences(
			@PathVariable String investigationId) {
		List<OntologySourceReferenceResponse> response = ontologySourceReferenceService
			.getAllOntologySourceReferences(investigationId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{sourceId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<OntologySourceReferenceResponse> getOntologySourceReferenceById(
			@PathVariable String investigationId, @PathVariable String sourceId) {
		OntologySourceReferenceResponse response = ontologySourceReferenceService
			.getOntologySourceReferenceById(sourceId);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{sourceId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<OntologySourceReferenceResponse> updateOntologySourceReference(
			@PathVariable String investigationId, @PathVariable String sourceId,
			@Valid @RequestBody UpdateOntologySourceReferenceRequest request) {
		OntologySourceReferenceResponse response = ontologySourceReferenceService.updateOntologySourceReference(request,
				sourceId);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{sourceId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<Void> deleteOntologySource(@PathVariable String investigationId,
			@PathVariable String sourceId) {
		ontologySourceReferenceService.deleteOntologySource(sourceId);
		return ResponseEntity.noContent().build();
	}

}
