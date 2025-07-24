package no.metatrack.api.dto;

import no.metatrack.api.node.OntologySourceReference;

public record OntologyAnnotationResponse(String id, String annotationValue, String termAccession,
		OntologySourceReference termSource) {
}
