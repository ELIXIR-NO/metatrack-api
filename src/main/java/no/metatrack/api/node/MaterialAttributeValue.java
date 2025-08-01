package no.metatrack.api.node;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Node("MaterialAttributeValue")
public class MaterialAttributeValue {

	@Id
	@Getter
	@Setter
	@GeneratedValue(UUIDStringGenerator.class)
	private String id;

	@Setter
	@Getter
	@Relationship(type = "IS_CATEGORY", direction = Relationship.Direction.OUTGOING)
	private MaterialAttribute category;

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
