package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Node("SampleAttributes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SampleAttribute {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	// column username
	@NonNull
	private String name;

	// value in the said column
	@NonNull
	private String value;

	// units of measurement, if any
	private String units;

}
