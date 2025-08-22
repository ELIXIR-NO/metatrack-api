package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.AssayResponse;
import no.metatrack.api.dto.CreateAssayRequest;
import no.metatrack.api.dto.UpdateAssayRequest;
import no.metatrack.api.service.AssayService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<AssayResponse> createAssay(@PathVariable String investigationId, @PathVariable String studyId,
			@Valid @RequestBody CreateAssayRequest request) {

		AssayResponse response = assayService.createNewAssay(studyId, request);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/studies/{studyId}/assays/{id}")
			.buildAndExpand(investigationId, studyId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

	@GetMapping("/{assayId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<AssayResponse> getAssayById(@PathVariable String assayId,
			@PathVariable String investigationId, @PathVariable String studyId) {
		AssayResponse response = assayService.getAssayById(assayId);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{assayId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<AssayResponse> updateAssay(UpdateAssayRequest request, @PathVariable String assayId,
			@PathVariable String investigationId, @PathVariable String studyId) {
		AssayResponse assayResponse = assayService.updateAssay(assayId, request);
		return ResponseEntity.ok(assayResponse);
	}

}
