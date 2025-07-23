package no.metatrack.api.dto;

import no.metatrack.api.node.SampleAttributes;

import java.util.Collection;

public record SampleResponse(String name, Collection<SampleAttributes> rawAttributes) {
}
