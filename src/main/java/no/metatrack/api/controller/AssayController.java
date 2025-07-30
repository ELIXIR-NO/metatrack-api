package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.AssayResponse;
import no.metatrack.api.dto.CreateAssayRequest;
import no.metatrack.api.service.AssayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/investigations/{investigationId}/studies/{studyId}/assays")
public class AssayController {

	private final AssayService assayService;

	public AssayController(AssayService assayService) {
		this.assayService = assayService;
	}

	@PostMapping
	public ResponseEntity<AssayResponse> createAssay(@PathVariable String investigationId, @PathVariable String studyId,
			@Valid @RequestBody CreateAssayRequest request) {

		AssayResponse response = assayService.createNewAssay(studyId, request);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/studies/{studyId}/assays/{id}")
			.buildAndExpand(investigationId, studyId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

}
