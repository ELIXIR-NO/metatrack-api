package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.ArrayList;
import java.util.List;

@Node("OntologySourceReference")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OntologySourceReference {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String name;

	private String version;

	private String file;

	private String description;

	@Relationship(type = "HAS_ONTOLOGY", direction = Relationship.Direction.INCOMING)
	private Investigation investigation;

	@Relationship(type = "HAS_ANNOTATION", direction = Relationship.Direction.OUTGOING)
	private List<OntologyAnnotation> annotations = new ArrayList<>();

}
