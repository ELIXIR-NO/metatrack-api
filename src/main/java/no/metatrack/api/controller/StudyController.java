package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateStudyRequest;
import no.metatrack.api.dto.CreateStudyResponse;
import no.metatrack.api.service.StudyService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping(value = "/api/v1/investigations/{investigationId}/studies", consumes = MediaType.APPLICATION_JSON_VALUE,
		produces = MediaType.APPLICATION_JSON_VALUE)
public class StudyController {

	private final StudyService studyService;

	public StudyController(StudyService studyService) {
		this.studyService = studyService;
	}

	@PostMapping
	public ResponseEntity<CreateStudyResponse> createStudy(@PathVariable String investigationId,
			@Valid @RequestBody CreateStudyRequest request) {

		CreateStudyResponse response = studyService.createNewStudy(request, investigationId);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/studies/{id}")
			.buildAndExpand(investigationId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

}
