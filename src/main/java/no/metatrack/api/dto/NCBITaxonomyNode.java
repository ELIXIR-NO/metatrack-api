package no.metatrack.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import no.metatrack.api.pojo.Taxonomy;

public record NCBITaxonomyNode(@JsonProperty("taxonomy") Taxonomy taxonomy) {

}
