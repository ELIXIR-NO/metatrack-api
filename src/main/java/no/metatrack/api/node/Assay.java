package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.HashSet;
import java.util.Set;

@Node("Assay")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assay {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String filename;

	@Relationship(type = "HAS_ASSAY", direction = Relationship.Direction.INCOMING)
	private Study study;

	@Relationship(type = "HAS_SAMPLE", direction = Relationship.Direction.OUTGOING)
	private Set<Sample> sample = new HashSet<>();

}
