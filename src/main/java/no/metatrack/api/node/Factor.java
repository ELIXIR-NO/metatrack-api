package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Node("Factor")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Factor {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String factorName;

	@Relationship(type = "HAS_FACTOR_TYPE", direction = Relationship.Direction.OUTGOING)
	private OntologyAnnotation factorType;

	@Relationship(type = "HAS_FACTOR", direction = Relationship.Direction.INCOMING)
	private Study study;

}
