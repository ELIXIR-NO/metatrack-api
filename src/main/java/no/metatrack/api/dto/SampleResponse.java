package no.metatrack.api.dto;

import no.metatrack.api.node.SampleAttribute;

import java.util.Collection;

public record SampleResponse(String name, Collection<SampleAttribute> rawAttributes) {
}
