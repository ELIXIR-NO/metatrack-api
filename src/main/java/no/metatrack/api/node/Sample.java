package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.ArrayList;
import java.util.List;

@Node("Sample")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sample {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String name;

	@Relationship(type = "IS_RAW_ATTRIBUTE", direction = Relationship.Direction.OUTGOING)
	private List<SampleAttributes> rawAttributes = new ArrayList<>();

	@Relationship(type = "HAS_SAMPLE", direction = Relationship.Direction.INCOMING)
	private Assay assay;

}
