package no.metatrack.api.repository;

import no.metatrack.api.node.Assay;
import no.metatrack.api.node.Study;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends Neo4jRepository<Study, String> {

	boolean existsByIdentifier(String identifier);

	@Query("match (s:Study {id: $studyId})-[:HAS_ASSAY]->(a:Assay) return a{.*, id: a.id}")
	List<Assay> findAllAssays(String studyId);

}
