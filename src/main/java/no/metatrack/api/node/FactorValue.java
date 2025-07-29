package no.metatrack.api.node;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

/**
 * Represents a value associated with a factor. A FactorValue can hold different types of
 * values, such as an ontology annotation, string, or numeric value, and is linked to
 * other entities through relationships.
 * <p>
 * This class is annotated as a Neo4j entity node and contains metadata to persist and
 * interact with the Neo4j database.
 * <p>
 * Attributes:
 * <ul>
 * <li>{@code id}: A unique identifier for the FactorValue generated using UUID</li>
 * <li>{@code category}: The factor this value is associated with</li>
 * <li>{@code unit}: The unit of measurement for this value, if any</li>
 * <li>{@code ontologyValue}: An ontology annotation representing the value</li>
 * <li>{@code stringValue}: A string representation of the value, if applicable</li>
 * <li>{@code numericValue}: A numeric representation of the value, if applicable</li>
 * </ul>
 * <p>
 * Methods:
 * <ul>
 * <li>{@code getValue}: Returns the value stored in the FactorValue as an object. The
 * returned value can be one of {@code OntologyAnnotation}, {@code String} or
 * {@code Number}</li>
 * <li>{@code setValue}: Sets the value for the FactorValue object. The method determines
 * the type of input object ({@code OntologyAnnotation}, {@code String}, or
 * {@code Number}) and assigns the corresponding value attribute</li>
 * </ul>
 */
@Node("FactorValues")
@NoArgsConstructor
public class FactorValue {

	@Id
	@Getter
	@Setter
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	@Setter
	@Getter
	@Relationship(type = "IS_CATEGORY", direction = Relationship.Direction.OUTGOING)
	private Factor category;

	@Setter
	@Getter
	@Relationship(type = "HAS_UNIT", direction = Relationship.Direction.OUTGOING)
	private OntologyAnnotation unit;

	@Relationship(type = "HAS_VALUE", direction = Relationship.Direction.OUTGOING)
	private OntologyAnnotation ontologyValue;

	private String stringValue;

	private Double numericValue;

	@JsonProperty("value")
	public Object getValue() {
		if (ontologyValue != null)
			return ontologyValue;
		if (stringValue != null)
			return stringValue;
		return numericValue;
	}

	public void setValue(Object value) {
		this.ontologyValue = null;
		this.stringValue = null;
		this.numericValue = null;

		if (value instanceof OntologyAnnotation) {
			this.ontologyValue = (OntologyAnnotation) value;
		}
		else if (value instanceof String) {
			this.stringValue = (String) value;
		}
		else if (value instanceof Number) {
			this.numericValue = ((Number) value).doubleValue();
		}
	}

}
