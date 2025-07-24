package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologySourceReferenceRequest;
import no.metatrack.api.dto.OntologySourceReferenceResponse;
import no.metatrack.api.service.OntologySourceReferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/investigation/{investigationId}/ontology/source")
public class OntologySourceReferenceController {

	private final OntologySourceReferenceService ontologySourceReferenceService;

	public OntologySourceReferenceController(OntologySourceReferenceService ontologySourceReferenceService) {
		this.ontologySourceReferenceService = ontologySourceReferenceService;
	}

	@PostMapping
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

}
