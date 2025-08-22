package no.metatrack.api.dto;

import jakarta.validation.constraints.Size;

public record UpdateAssayRequest(
		@Size(min = 2, max = 50, message = "filename must be between 2 and 50 characters") String filename) {
}
