package no.metatrack.api.service;

import no.metatrack.api.dto.AssayResponse;
import no.metatrack.api.dto.CreateAssayRequest;
import no.metatrack.api.node.Assay;
import no.metatrack.api.node.Study;
import no.metatrack.api.repository.AssayRepository;
import no.metatrack.api.repository.StudyRepository;
import no.metatrack.api.utils.TextUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssayService {

	private final StudyRepository studyRepository;

	private final AssayRepository assayRepository;

	public AssayService(StudyRepository studyRepository, AssayRepository assayRepository) {
		this.studyRepository = studyRepository;
		this.assayRepository = assayRepository;
	}

	@Transactional
	public AssayResponse createNewAssay(String studyId, CreateAssayRequest request) {
		Study study = studyRepository.findById(studyId).orElseThrow();

		Assay newAssay = Assay.builder()
			.filename(TextUtils.convertBlankStringToNull(request.filename()))
			.study(study)
			.build();

		Assay savedAssay = assayRepository.save(newAssay);
		return new AssayResponse(savedAssay.getId(), savedAssay.getFilename());
	}

}
