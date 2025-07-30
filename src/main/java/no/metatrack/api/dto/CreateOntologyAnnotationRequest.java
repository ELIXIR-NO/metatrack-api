package no.metatrack.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateOntologyAnnotationRequest(@NotBlank String annotationValue, @NotBlank String termAccession) {
}
