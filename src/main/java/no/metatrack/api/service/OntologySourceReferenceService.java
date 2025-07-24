package no.metatrack.api.service;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologySourceReferenceRequest;
import no.metatrack.api.dto.OntologySourceReferenceResponse;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.OntologySourceReference;
import no.metatrack.api.repository.InvestigationRepository;
import no.metatrack.api.repository.OntologySourceReferenceRepository;
import no.metatrack.api.utils.TextUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OntologySourceReferenceService {

	private final InvestigationRepository investigationRepository;

	private final OntologySourceReferenceRepository ontologySourceReferenceRepository;

	public OntologySourceReferenceService(InvestigationRepository investigationRepository,
			OntologySourceReferenceRepository ontologySourceReferenceRepository) {
		this.investigationRepository = investigationRepository;
		this.ontologySourceReferenceRepository = ontologySourceReferenceRepository;
	}

	@Transactional
	public OntologySourceReferenceResponse createNewOntologySourceReference(String investigationId,
			@Valid CreateOntologySourceReferenceRequest request) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();

		OntologySourceReference ontologySourceReference = OntologySourceReference.builder()
			.name(request.name())
			.file(request.file())
			.version(request.version())
			.description(TextUtils.convertBlankStringToNull(request.description()))
			.investigation(investigation)
			.build();

		OntologySourceReference savedOntologySourceReference = ontologySourceReferenceRepository
			.save(ontologySourceReference);

		return convertToOntologySourceReferenceResponse(savedOntologySourceReference);

	}

	private OntologySourceReferenceResponse convertToOntologySourceReferenceResponse(
			OntologySourceReference ontologySourceReference) {
		return new OntologySourceReferenceResponse(ontologySourceReference.getId(), ontologySourceReference.getName(),
				ontologySourceReference.getFile(), ontologySourceReference.getVersion(),
				ontologySourceReference.getDescription());
	}

}
