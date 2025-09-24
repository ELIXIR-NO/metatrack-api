package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.*;
import no.metatrack.api.service.SampleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/investigations/{investigationId}/studies/{studyId}/assays/{assayId}/samples")
public class SampleController {

	private final SampleService sampleService;

	public SampleController(SampleService sampleService) {
		this.sampleService = sampleService;
	}

	@PostMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<SampleResponse> createSample(@PathVariable String investigationId,
			@PathVariable String studyId, @PathVariable String assayId,
			@Valid @RequestBody CreateSampleRequest request) {

		SampleResponse response = sampleService.createNewSample(assayId, request);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/studies/{studyId}/assays/{assayId}/samples/{id}")
			.buildAndExpand(investigationId, studyId, assayId, response.name())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

	@PutMapping("/id/{sampleId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<Void> updateSample(@PathVariable String assayId, @PathVariable String investigationId,
			@PathVariable String sampleId, @PathVariable String studyId,
			@Valid @RequestBody UpdateSampleRequest request) {

		sampleService.updateSampleById(sampleId, request);

		return ResponseEntity.noContent().build();

	}

	@GetMapping("/id/{sampleId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<SampleResponse> getSampleById(@PathVariable String investigationId,
			@PathVariable String studyId, @PathVariable String assayId, @PathVariable String sampleId) {
		SampleResponse response = sampleService.getSampleById(sampleId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/name/{sampleName}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<SampleResponse> getSampleByName(@PathVariable String investigationId,
			@PathVariable String studyId, @PathVariable String assayId, @PathVariable String sampleName) {
		SampleResponse response = sampleService.getSampleByName(sampleName);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<List<SampleResponse>> getAllSamplesInAssay(@PathVariable String investigationId,
			@PathVariable String studyId, @PathVariable String assayId) {

		List<SampleResponse> response = sampleService.getAllSamples(assayId);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/id/{sampleId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<Void> deleteSample(@PathVariable String investigationId, @PathVariable String studyId,
			@PathVariable String assayId, @PathVariable String sampleId) {
		sampleService.deleteSampleById(sampleId);

		return ResponseEntity.noContent().build();
	}

	@PostMapping("/upload")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<Void> uploadSampleTable(@PathVariable String assayId,
			@RequestParam("file") MultipartFile file, @PathVariable String investigationId,
			@PathVariable String studyId) {
		sampleService.uploadSampleTable(assayId, file);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/batch-edit")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<BatchUpdateSamplesResponse> batchEditSamples(@PathVariable String investigationId,
			@PathVariable String studyId, @PathVariable String assayId,
			@Valid @RequestBody BatchUpdateSamplesRequest request) {
		BatchUpdateSamplesResponse response = sampleService.batchUpdate(request);

		return ResponseEntity.ok(response);
	}

}
