package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Node("MaterialAttribute")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialAttribute {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	@Relationship(type = "HAS_CHARACTERISTIC_TYPE", direction = Relationship.Direction.OUTGOING)
	private OntologyAnnotation characteristicType;

	@Relationship(type = "HAS_CHARACTERISTIC", direction = Relationship.Direction.INCOMING)
	private Study study;

}
