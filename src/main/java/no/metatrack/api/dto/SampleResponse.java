package no.metatrack.api.dto;

import no.metatrack.api.node.FactorValue;
import no.metatrack.api.node.MaterialAttributeValue;
import no.metatrack.api.node.SampleAttribute;
import no.metatrack.api.node.Source;

import java.util.Collection;

public record SampleResponse(String id, String name, Collection<SampleAttribute> rawAttributes,
		Collection<MaterialAttributeValue> materialAttributeValues, Collection<FactorValue> factorValues,
		Collection<Source> sources) {
}
