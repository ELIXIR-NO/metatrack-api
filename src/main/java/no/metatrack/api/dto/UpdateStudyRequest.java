package no.metatrack.api.dto;

import jakarta.validation.constraints.Size;

public record UpdateStudyRequest(
		@Size(min = 2, max = 50, message = "Identifier must be between 2 and 50 characters") String identifier,

		@Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters") String title,

		@Size(max = 2000, message = "Description cannot exceed 2000 characters") String description,

		@Size(max = 255, message = "Filename cannot exceed 255 characters") String filename) {
}
