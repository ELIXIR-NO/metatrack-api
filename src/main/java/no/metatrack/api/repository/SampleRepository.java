package no.metatrack.api.repository;

import no.metatrack.api.node.Sample;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SampleRepository extends Neo4jRepository<Sample, String> {

	boolean existsByName(String name);

	Optional<Sample> findByName(String name);

	@Query("""
			MATCH (s:Sample {id: $sampleId})
			OPTIONAL MATCH (s)-[:IS_RAW_ATTRIBUTE|HAS_CHARACTERISTIC|HAS_FACTOR_VALUE|DERIVES_FROM]->(child)
			DETACH DELETE child
			DETACH DELETE s
			""")
	void deleteByAndChildNodesBySampleId(String sampleId);

}
