package no.metatrack.api.dto;

public record SimpleFactorValueResponse(String id, SimpleFactorResponse category, SimpleOntologyAnnotationResponse unit,
		Object value) {
}
