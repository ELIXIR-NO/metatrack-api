package no.metatrack.api.repository;

import no.metatrack.api.node.SampleAttribute;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleAttributeRepository extends Neo4jRepository<SampleAttribute, String> {

}
