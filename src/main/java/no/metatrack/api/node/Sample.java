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

	// To store arbitrary data from sample sheets
	@Relationship(type = "IS_RAW_ATTRIBUTE", direction = Relationship.Direction.OUTGOING)
	private List<SampleAttribute> rawAttributes = new ArrayList<>();

	@Relationship(type = "HAS_SAMPLE", direction = Relationship.Direction.INCOMING)
	private Assay assay;

	@Relationship(type = "HAS_CHARACTERISTIC", direction = Relationship.Direction.OUTGOING)
	private List<MaterialAttributeValue> characteristics = new ArrayList<>();

	@Relationship(type = "HAS_FACTOR_VALUE", direction = Relationship.Direction.OUTGOING)
	private List<FactorValues> factorsValues = new ArrayList<>();

	@Relationship(type = "DERIVES_FROM", direction = Relationship.Direction.OUTGOING)
	private List<Source> derivedFrom = new ArrayList<>();

}
