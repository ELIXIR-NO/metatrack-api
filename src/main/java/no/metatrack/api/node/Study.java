package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Node("Study")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Study {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String identifier;

	private String title;

	private String description;

	private String filename;

	@Relationship(type = "HAS_STUDY", direction = Relationship.Direction.INCOMING)
	private Investigation investigation;

}
