package no.metatrack.api.dto;

import java.util.Collection;

public record SimpleSourceResponse(String id, String name,
		Collection<SimpleMaterialAttributeValueResponse> characteristics) {
}
