package no.metatrack.api.dto;

import jakarta.validation.constraints.Size;

public record UpdateOntologySourceReferenceRequest(String name, String version, String file,
		@Size(min = 10, max = 500) String description) {

}
