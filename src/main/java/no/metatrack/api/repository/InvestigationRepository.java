package no.metatrack.api.repository;

import no.metatrack.api.node.Investigation;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestigationRepository extends Neo4jRepository<Investigation, String> {

	Boolean existsByIdentifier(String identifier);

}
