package no.metatrack.api.node;

import lombok.*;
import no.metatrack.api.relations.InvestigationMember;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.util.HashSet;
import java.util.Set;

@Node("Investigation")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Investigation {

	@Id
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	private String identifier;

	private String title;

	private String description;

	private String filename;

	@Builder.Default
	@Relationship(type = "HAS_MEMBER", direction = Relationship.Direction.OUTGOING)
	private Set<InvestigationMember> members = new HashSet<>();

}
