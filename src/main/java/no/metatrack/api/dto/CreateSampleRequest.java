package no.metatrack.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import no.metatrack.api.node.SampleAttribute;

import java.util.List;

public record CreateSampleRequest(
		@NotBlank(message = "Name is required") @Size(min = 2, max = 50,
				message = "Name must be between 2 and 50 characters") String name,

		@NotEmpty(message = "Raw attributes are required") @Valid List<SampleAttribute> rawAttributes) {
}
