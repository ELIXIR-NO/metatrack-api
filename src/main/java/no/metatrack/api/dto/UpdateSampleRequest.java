package no.metatrack.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateSampleRequest(
		@Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters") String name,

		@Valid List<RawAttributeDto> rawAttributes) {

	public record RawAttributeDto(@NotBlank(message = "Attribute name must not be blank") String attributeName,

			@NotBlank(message = "Attribute value must not be blank") String value,

			@Size(max = 100, message = "Unit must be at most 100 characters") String unit) {
	}
}
