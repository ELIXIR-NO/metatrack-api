package no.metatrack.api.config;

import io.minio.MinioClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "minio")
@Data
public class MinioConfig {

	public String endpoint, accessKey, secretKey, bucket;

	@Bean
	public MinioClient minioClient() {
		return MinioClient.builder().endpoint(endpoint).credentials(accessKey, secretKey).build();
	}

}
