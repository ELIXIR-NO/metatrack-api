package no.metatrack.api.repository;

import no.metatrack.api.node.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends Neo4jRepository<User, String> {

	Boolean existsByEmail(String email);

}
