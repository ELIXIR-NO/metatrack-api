package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateSampleRequest;
import no.metatrack.api.dto.SampleResponse;
import no.metatrack.api.service.SampleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/investigations/{investigationId}/studies/{studyId}/assays/{assayId}/samples")
public class SampleController {

	private final SampleService sampleService;

	public SampleController(SampleService sampleService) {
		this.sampleService = sampleService;
	}

	@PostMapping
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

}
