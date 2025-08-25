package no.metatrack.api.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.metatrack.api.enums.TaxonomyRank;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Taxonomy {

	@JsonProperty("tax_id")
	private String taxId;

	@JsonProperty("organism_name")
	private String organismName;

	@JsonProperty("common_name")
	private String commonName;

	@JsonProperty("genbank_common_name")
	private String genbankCommonName;

	@JsonProperty("acronyms")
	private List<String> acronyms;

	@JsonProperty("genbank_acronym")
	private String genbankAcronym;

	@JsonProperty("blast_name")
	private String blastName;

	@JsonProperty("lineage")
	private List<Integer> lineage;

	@JsonProperty("children")
	private List<Integer> children;

	@JsonProperty("rank")
	private TaxonomyRank rank;

	@JsonProperty("has_described_species_name")
	private Boolean hasDescribedSpeciesName;

	@JsonProperty("counts")
	private List<TaxonomyCount> counts;

	@JsonProperty("min_ord")
	private Integer minOrd;

	@JsonProperty("max_ord")
	private Integer maxOrd;

	@JsonProperty("extinct")
	private Boolean extinct;

	@JsonProperty("genomic_moltype")
	private String genomicMoltype;

}
