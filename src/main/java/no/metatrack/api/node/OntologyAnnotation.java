package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Node("OntologyAnnotation")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OntologyAnnotation {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	@Relationship(type = "HAS_ANNOTATION", direction = Relationship.Direction.INCOMING)
	private OntologySourceReference termSource;

	private String termAccession;

	private String annotationValue;

}
