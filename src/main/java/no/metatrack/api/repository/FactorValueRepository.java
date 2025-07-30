package no.metatrack.api.repository;

import no.metatrack.api.node.FactorValue;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FactorValueRepository extends Neo4jRepository<FactorValue, String> {

}
