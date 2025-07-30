package no.metatrack.api.node;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.ArrayList;
import java.util.List;

@Node
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Source {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String name;

	@Relationship(type = "HAS_CHARACTERISTIC", direction = Relationship.Direction.OUTGOING)
	private List<MaterialAttributeValue> characteristics = new ArrayList<>();

}
