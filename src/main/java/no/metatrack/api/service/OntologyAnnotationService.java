package no.metatrack.api.service;

import jakarta.validation.Valid;
import no.metatrack.api.dto.CreateOntologyAnnotationRequest;
import no.metatrack.api.dto.OntologyAnnotationResponse;
import no.metatrack.api.dto.UpdateOntologyAnnotationRequest;
import no.metatrack.api.node.OntologyAnnotation;
import no.metatrack.api.node.OntologySourceReference;
import no.metatrack.api.repository.OntologyAnnotationRepository;
import no.metatrack.api.repository.OntologySourceReferenceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OntologyAnnotationService {

	private final OntologySourceReferenceRepository ontologySourceReferenceRepository;

	private final OntologyAnnotationRepository ontologyAnnotationRepository;

	public OntologyAnnotationService(OntologySourceReferenceRepository ontologySourceReferenceRepository,
			OntologyAnnotationRepository ontologyAnnotationRepository) {
		this.ontologySourceReferenceRepository = ontologySourceReferenceRepository;
		this.ontologyAnnotationRepository = ontologyAnnotationRepository;
	}

	public OntologyAnnotationResponse createNewAnnotation(String sourceId, CreateOntologyAnnotationRequest request) {
		OntologySourceReference sourceReference = ontologySourceReferenceRepository.findById(sourceId).orElseThrow();

		OntologyAnnotation annotation = OntologyAnnotation.builder()
			.annotationValue(request.annotationValue())
			.termAccession(request.termAccession())
			.termSource(sourceReference)
			.build();

		OntologyAnnotation savedAnnotation = ontologyAnnotationRepository.save(annotation);
		return convertToOntologyAnnotationResponse(savedAnnotation);
	}

	private OntologyAnnotationResponse convertToOntologyAnnotationResponse(OntologyAnnotation annotation) {
		return new OntologyAnnotationResponse(annotation.getId(), annotation.getAnnotationValue(),
				annotation.getTermAccession(), annotation.getTermSource());
	}

	public OntologyAnnotationResponse getOntologyAnnotationById(String annotationId) {
		return convertToOntologyAnnotationResponse(ontologyAnnotationRepository.findById(annotationId).orElseThrow());
	}

	public List<OntologyAnnotationResponse> getAllAnnotations(String sourceId) {
		List<OntologyAnnotation> annotations = ontologySourceReferenceRepository.findAllOntologyAnnotations(sourceId);

		return annotations.stream().map(this::convertToOntologyAnnotationResponse).toList();
	}

	public OntologyAnnotationResponse updateAnnotation(String annotationId,
			@Valid UpdateOntologyAnnotationRequest request) {
		OntologyAnnotation annotation = ontologyAnnotationRepository.findById(annotationId).orElseThrow();
		if (request.annotationValue() != null) {
			annotation.setAnnotationValue(request.annotationValue().trim());
		}
		if (request.termAccession() != null) {
			annotation.setTermAccession(request.termAccession().trim());
		}
		OntologyAnnotation savedAnnotation = ontologyAnnotationRepository.save(annotation);
		return convertToOntologyAnnotationResponse(savedAnnotation);
	}

	public void deleteOntologyAnnotation(String annotationId) {
		ontologyAnnotationRepository.deleteById(annotationId);
	}

}
