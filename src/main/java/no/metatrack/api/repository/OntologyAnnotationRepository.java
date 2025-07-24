package no.metatrack.api.repository;

import no.metatrack.api.node.OntologyAnnotation;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OntologyAnnotationRepository extends Neo4jRepository<OntologyAnnotation, String> {

}
