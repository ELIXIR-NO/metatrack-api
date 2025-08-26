package no.metatrack.api.repository;

import no.metatrack.api.node.OntologyAnnotation;
import no.metatrack.api.node.OntologySourceReference;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OntologySourceReferenceRepository extends Neo4jRepository<OntologySourceReference, String> {

	@Query("match (s:OntologySourceReference {id: $sourceId})-[:HAS_ANNOTATION]->(a:OntologyAnnotation) return a{.*, id: a.id}")
	List<OntologyAnnotation> findAllOntologyAnnotations(String sourceId);

	@Query("""
			match (s:OntologySourceReference {id: $sourceId})-[:HAS_ANNOTATION]->(a:OntologyAnnotation)
			detach delete a
			detach delete s
			""")
	void deleteOntologySourceReferenceAndAnnotations(String sourceId);

}
