package no.metatrack.api.dto;

import no.metatrack.api.node.SampleAttribute;

import java.util.Collection;

public record SampleResponse(String id, String name, Collection<SampleAttribute> rawAttributes,
		Collection<SimpleMaterialAttributeValueResponse> materialAttributeValues,
		Collection<SimpleFactorValueResponse> factorValues, Collection<SimpleSourceResponse> sources) {
}
