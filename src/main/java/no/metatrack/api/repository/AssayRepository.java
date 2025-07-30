package no.metatrack.api.repository;

import no.metatrack.api.node.Assay;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssayRepository extends Neo4jRepository<Assay, String> {

}
