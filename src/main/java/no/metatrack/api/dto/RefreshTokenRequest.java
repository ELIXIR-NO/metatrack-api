package no.metatrack.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;

public record RefreshTokenRequest(
		@NotEmpty(message = "Refresh token must not be empty") @JsonProperty("refresh_token") String refreshToken) {
}
