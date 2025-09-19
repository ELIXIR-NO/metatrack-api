package no.metatrack.api.repository;

import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.OntologySourceReference;
import no.metatrack.api.node.Study;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationRepository extends Neo4jRepository<Investigation, String> {

	Boolean existsByIdentifier(String identifier);

	@Query("match (i:Investigation)-[:HAS_MEMBER]->(u:User {id: $userId}) return i")
	List<Investigation> findAllByUserId(String userId);

	@Query("""
			    MATCH (i:Investigation {id: $investigationId})-[:HAS_STUDY]->(s:Study)
			    RETURN
			        s.id AS id,
			        s.identifier AS identifier,
			        s.title AS title,
			        s.description AS description,
			        s.filename AS filename
			""")
	List<Study> findAllStudies(String investigationId);

	@Query("match (i:Investigation {id: $investigationId})-[:HAS_ONTOLOGY]->(o:OntologySourceReference) return o")
	List<OntologySourceReference> findAllOntologySourceReferences(String investigationId);

}
