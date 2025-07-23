package no.metatrack.api.relations;

import lombok.*;
import no.metatrack.api.enums.InvestigationRole;
import no.metatrack.api.node.User;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestigationMember {

	@Id
	@GeneratedValue
	private Long id;

	@TargetNode
	private User user;

	private InvestigationRole role;

}
