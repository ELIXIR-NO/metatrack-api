package no.metatrack.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOntologySourceReferenceRequest(@NotBlank String name, @NotBlank String version,
		@NotBlank String file, @Size(min = 10, max = 500) String description) {
}
