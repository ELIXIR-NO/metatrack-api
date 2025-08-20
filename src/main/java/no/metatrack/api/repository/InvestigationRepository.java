package no.metatrack.api.repository;

import no.metatrack.api.node.Investigation;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationRepository extends Neo4jRepository<Investigation, String> {

	Boolean existsByIdentifier(String identifier);

	@Query("match (i:Investigation)-[:HAS_MEMBER]->(u:User {id: $userId}) return i")
	List<Investigation> findAllByUserId(String userId);

}
