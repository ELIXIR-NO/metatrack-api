package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologyAnnotationRequest;
import no.metatrack.api.dto.OntologyAnnotationResponse;
import no.metatrack.api.service.OntologyAnnotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/investigations/{investigationId}/ontology/sources/{sourceId}/annotations")
public class OntologyAnnotationController {

	private final OntologyAnnotationService ontologyAnnotationService;

	public OntologyAnnotationController(OntologyAnnotationService ontologyAnnotationService) {
		this.ontologyAnnotationService = ontologyAnnotationService;
	}

	@PostMapping
	public ResponseEntity<OntologyAnnotationResponse> createOntologyAnnotation(@PathVariable String investigationId,
			@PathVariable String sourceId, @Valid @RequestBody CreateOntologyAnnotationRequest request) {

		OntologyAnnotationResponse response = ontologyAnnotationService.createNewAnnotation(sourceId, request);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/ontology/sources/{sourceId}/annotations/{id}")
			.buildAndExpand(investigationId, sourceId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);

	}

}
