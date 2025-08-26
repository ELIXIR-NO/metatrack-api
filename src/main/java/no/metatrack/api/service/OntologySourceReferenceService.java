package no.metatrack.api.service;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologySourceReferenceRequest;
import no.metatrack.api.dto.OntologySourceReferenceResponse;
import no.metatrack.api.dto.UpdateOntologySourceReferenceRequest;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.OntologySourceReference;
import no.metatrack.api.repository.InvestigationRepository;
import no.metatrack.api.repository.OntologySourceReferenceRepository;
import no.metatrack.api.utils.TextUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

	public List<OntologySourceReferenceResponse> getAllOntologySourceReferences(String investigationId) {
		List<OntologySourceReference> references = investigationRepository
			.findAllOntologySourceReferences(investigationId);

		return references.stream().map(this::convertToOntologySourceReferenceResponse).toList();
	}

	public OntologySourceReferenceResponse getOntologySourceReferenceById(String sourceId) {
		OntologySourceReference sourceReference = ontologySourceReferenceRepository.findById(sourceId).orElseThrow();
		return convertToOntologySourceReferenceResponse(sourceReference);
	}

	public OntologySourceReferenceResponse updateOntologySourceReference(
			@Valid UpdateOntologySourceReferenceRequest request, String sourceId) {
		OntologySourceReference sourceReference = ontologySourceReferenceRepository.findById(sourceId).orElseThrow();
		if (request.name() != null) {
			sourceReference.setName(request.name().trim());
		}
		if (request.file() != null) {
			sourceReference.setFile(request.file().trim());
		}
		if (request.version() != null) {
			sourceReference.setVersion(request.version().trim());
		}
		if (request.description() != null) {
			sourceReference.setDescription(request.description().trim());
		}

		OntologySourceReference savedOntologySourceReference = ontologySourceReferenceRepository.save(sourceReference);

		return convertToOntologySourceReferenceResponse(savedOntologySourceReference);
	}

	public void deleteOntologySource(String sourceId) {
		ontologySourceReferenceRepository.deleteById(sourceId);
	}

	public void deleteOntologySourceAndAnnotations(String sourceId) {
		ontologySourceReferenceRepository.deleteOntologySourceReferenceAndAnnotations(sourceId);
	}

}
