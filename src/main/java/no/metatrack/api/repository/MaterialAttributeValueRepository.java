package no.metatrack.api.repository;

import no.metatrack.api.node.MaterialAttributeValue;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialAttributeValueRepository extends Neo4jRepository<MaterialAttributeValue, String> {

}
