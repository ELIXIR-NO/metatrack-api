package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologyAnnotationRequest;
import no.metatrack.api.dto.SimpleOntologyAnnotationResponse;
import no.metatrack.api.dto.UpdateOntologyAnnotationRequest;
import no.metatrack.api.service.OntologyAnnotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/investigations/{investigationId}/ontology/sources/{sourceId}/annotations")
public class OntologyAnnotationController {

	private final OntologyAnnotationService ontologyAnnotationService;

	public OntologyAnnotationController(OntologyAnnotationService ontologyAnnotationService) {
		this.ontologyAnnotationService = ontologyAnnotationService;
	}

	@PostMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<SimpleOntologyAnnotationResponse> createOntologyAnnotation(
			@PathVariable String investigationId, @PathVariable String sourceId,
			@Valid @RequestBody CreateOntologyAnnotationRequest request) {

		SimpleOntologyAnnotationResponse response = ontologyAnnotationService.createNewAnnotation(sourceId, request);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/ontology/sources/{sourceId}/annotations/{id}")
			.buildAndExpand(investigationId, sourceId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);

	}

	@GetMapping("/{annotationId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<SimpleOntologyAnnotationResponse> getOntologyAnnotation(@PathVariable String investigationId,
			@PathVariable String sourceId, @PathVariable String annotationId) {

		SimpleOntologyAnnotationResponse response = ontologyAnnotationService.getOntologyAnnotationById(annotationId);

		return ResponseEntity.ok(response);
	}

	@GetMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<List<SimpleOntologyAnnotationResponse>> getAllOntologyAnnotations(
			@PathVariable String investigationId, @PathVariable String sourceId) {

		List<SimpleOntologyAnnotationResponse> response = ontologyAnnotationService.getAllAnnotations(sourceId);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/{annotationId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<SimpleOntologyAnnotationResponse> updateOntologyAnnotation(
			@PathVariable String investigationId, @PathVariable String sourceId, @PathVariable String annotationId,
			@Valid @RequestBody UpdateOntologyAnnotationRequest request) {

		SimpleOntologyAnnotationResponse response = ontologyAnnotationService.updateAnnotation(annotationId, request);

		return ResponseEntity.ok(response);

	}

	@DeleteMapping("/{annotationId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<Void> deleteOntologySourceAnnotation(@PathVariable String annotationId,
			@PathVariable String investigationId, @PathVariable String sourceId) {

		ontologyAnnotationService.deleteOntologyAnnotation(annotationId);

		return ResponseEntity.noContent().build();
	}

	@PostMapping("/batch")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<Void> createMultipleOntologyAnnotations(@PathVariable String investigationId,
			@PathVariable String sourceId, @Valid @RequestBody List<String> request) {

		ontologyAnnotationService.batchAddOntologyAnnotations(sourceId, request);

		return ResponseEntity.ok().build();
	}

}
