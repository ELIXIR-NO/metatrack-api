package no.metatrack.api.service;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateStudyRequest;
import no.metatrack.api.dto.StudyResponse;
import no.metatrack.api.dto.UpdateStudyRequest;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.Study;
import no.metatrack.api.repository.InvestigationRepository;
import no.metatrack.api.repository.StudyRepository;
import no.metatrack.api.utils.TextUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudyService {

	private final InvestigationRepository investigationRepository;

	private final StudyRepository studyRepository;

	public StudyService(InvestigationRepository investigationRepository, StudyRepository studyRepository) {
		this.investigationRepository = investigationRepository;
		this.studyRepository = studyRepository;
	}

	@Transactional
	public StudyResponse createNewStudy(@Valid CreateStudyRequest request, String investigationId) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();

		Study newStudy = Study.builder()
			.identifier(request.identifier())
			.title(request.title())
			.description(TextUtils.convertBlankStringToNull(request.description()))
			.filename(TextUtils.convertBlankStringToNull(request.filename()))
			.investigation(investigation)
			.build();

		Study savedStudy = studyRepository.save(newStudy);

		return convertToStudyResponse(savedStudy);
	}

	public StudyResponse getStudyById(String studyId) {
		Study study = studyRepository.findById(studyId).orElseThrow();
		return convertToStudyResponse(study);
	}

	private StudyResponse convertToStudyResponse(Study study) {
		return new StudyResponse(study.getId(), study.getIdentifier(), study.getTitle(), study.getDescription(),
				study.getFilename());
	}

	public StudyResponse updateStudy(@Valid UpdateStudyRequest request, String studyId) {
		boolean checkStudyIdentifier = studyRepository.existsByIdentifier(request.identifier().trim());
		if (checkStudyIdentifier)
			throw new ResourceAlreadyExistsException("Identifier is already in use!");

		Study study = studyRepository.findById(studyId).orElseThrow();

		if (request.identifier() != null) {
			study.setIdentifier(request.identifier().trim());
		}
		if (request.title() != null) {
			study.setTitle(request.title().trim());
		}
		if (request.description() != null) {
			study.setDescription(request.description().trim());
		}
		if (request.filename() != null) {
			study.setFilename(request.filename().trim());
		}

		Study savedStudy = studyRepository.save(study);
		return convertToStudyResponse(savedStudy);
	}

}
