package no.metatrack.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
		@Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters") String username,

		@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
		@Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters") String firstName,
		@Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters") String lastName,
		@NotBlank(message = "Password is required") @Size(min = 8, max = 100,
				message = "Password must be between 8 and 100 characters") String password) {
}
