package no.metatrack.api.config.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@ConfigurationProperties(prefix = "cors")
@Data
@Component
public class CorsProperties {

	private List<String> allowedOrigins;

}