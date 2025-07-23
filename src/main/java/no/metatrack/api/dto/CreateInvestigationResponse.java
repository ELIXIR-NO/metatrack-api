package no.metatrack.api.dto;

public record CreateInvestigationResponse(String id, String identifier, String title, String description,
		String filename) {
}
