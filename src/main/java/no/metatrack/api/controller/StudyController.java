package no.metatrack.api.controller;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateStudyRequest;
import no.metatrack.api.dto.StudyResponse;
import no.metatrack.api.dto.UpdateStudyRequest;
import no.metatrack.api.service.StudyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/investigations/{investigationId}/studies")
public class StudyController {

	private final StudyService studyService;

	public StudyController(StudyService studyService) {
		this.studyService = studyService;
	}

	@PostMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<StudyResponse> createStudy(@PathVariable String investigationId,
			@Valid @RequestBody CreateStudyRequest request) {

		StudyResponse response = studyService.createNewStudy(request, investigationId);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
			.path("/api/v1/investigations/{investigationId}/studies/{id}")
			.buildAndExpand(investigationId, response.id())
			.toUri();

		return ResponseEntity.created(location).body(response);
	}

	@GetMapping
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<List<StudyResponse>> getAllStudies(@PathVariable String investigationId) {
		List<StudyResponse> studies = studyService.getAllStudies(investigationId);
		return ResponseEntity.ok(studies);
	}

	@GetMapping("/{studyId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).READER)")
	public ResponseEntity<StudyResponse> getStudyById(@PathVariable String investigationId,
			@PathVariable String studyId) {
		StudyResponse studyResponse = studyService.getStudyById(studyId);
		return ResponseEntity.ok(studyResponse);
	}

	@PutMapping("/{studyId}")
	@PreAuthorize("@investigationAccess.hasAtLeast(#investigationId, T(no.metatrack.api.enums.InvestigationRole).WRITER)")
	public ResponseEntity<StudyResponse> updateStudy(@Valid @RequestBody UpdateStudyRequest request,
			@PathVariable String investigationId, @PathVariable String studyId) {
		StudyResponse studyResponse = studyService.updateStudy(request, studyId);
		return ResponseEntity.ok(studyResponse);
	}

}
