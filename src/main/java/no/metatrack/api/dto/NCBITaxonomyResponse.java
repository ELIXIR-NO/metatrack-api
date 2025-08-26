package no.metatrack.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record NCBITaxonomyResponse(@JsonProperty("taxonomy_nodes") List<NCBITaxonomyNode> taxonomyNodes) {
}
