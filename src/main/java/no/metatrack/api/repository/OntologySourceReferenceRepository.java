package no.metatrack.api.repository;

import no.metatrack.api.node.OntologySourceReference;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OntologySourceReferenceRepository extends Neo4jRepository<OntologySourceReference, String> {

}
