package no.metatrack.api.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.metatrack.api.enums.TaxonomyCountsType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public final class TaxonomyCount {

	@JsonProperty("type")
	private TaxonomyCountsType type;

	@JsonProperty("count")
	private Integer count;

}
