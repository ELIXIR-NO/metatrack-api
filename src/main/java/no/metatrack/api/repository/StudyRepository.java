package no.metatrack.api.repository;

import no.metatrack.api.node.Study;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyRepository extends Neo4jRepository<Study, String> {
    
}
