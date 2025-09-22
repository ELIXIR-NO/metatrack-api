package no.metatrack.api.config.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final List<String> allowedOrigins;

	public SecurityConfig(CorsProperties corsProperties) {
		this.allowedOrigins = corsProperties.getAllowedOrigins();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public JwtDecoder jwtDecoder(
			@Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}") String issuer) {
		return JwtDecoders.fromIssuerLocation(issuer);
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.authorizeHttpRequests(authorize -> authorize.requestMatchers("/swagger-ui/**")
				.permitAll()
				.requestMatchers("/swagger-resources/**")
				.permitAll()
				.requestMatchers("/v3/api-docs/**")
				.permitAll()
				.requestMatchers("/docs.html")
				.permitAll()
				.requestMatchers("/auth/**")
				.permitAll()
				.requestMatchers("/actuator/health/**")
				.permitAll()
				.requestMatchers("/api/**")
				.authenticated()
				.anyRequest()
				.authenticated())
			.oauth2ResourceServer(
					oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtAuthConverter()))
						.authenticationEntryPoint(
								((_, response, _) -> response.setStatus(HttpServletResponse.SC_UNAUTHORIZED))))
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(allowedOrigins);

		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));

		configuration.setAllowCredentials(true);

		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", configuration);
		source.registerCorsConfiguration("/auth/**", configuration);

		return source;
	}

	private JwtAuthenticationConverter keycloakJwtAuthConverter() {
		var converter = new JwtAuthenticationConverter();
		converter.setJwtGrantedAuthoritiesConverter(jwt -> {
			var authoritiesConverter = new JwtGrantedAuthoritiesConverter();
			Collection<GrantedAuthority> granted = authoritiesConverter.convert(jwt);

			var realmRoles = jwt.getClaimAsMap("real_access");
			if (realmRoles != null && realmRoles.get("roles") instanceof Collection<?> roles) {
				Set<SimpleGrantedAuthority> mapped = roles.stream()
					.map(String::valueOf)
					.map(r -> "ROLE_" + r.toUpperCase())
					.map(SimpleGrantedAuthority::new)
					.collect(Collectors.toSet());
				granted.addAll(mapped);
				return granted;
			}

			var resourceAccess = jwt.getClaimAsMap("resource_access");
			if (resourceAccess != null && resourceAccess.get("metatrack_api") instanceof java.util.Map<?, ?> client) {
				var clientRoles = client.get("roles");
				if (clientRoles instanceof Collection<?> cRoles) {
					Set<SimpleGrantedAuthority> mappedClient = cRoles.stream()
						.map(String::valueOf)
						.map(r -> "ROLE_" + r.toUpperCase())
						.map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
						.collect(Collectors.toSet());
					granted.addAll(mappedClient);
				}
			}
			return granted;

		});
		return converter;
	}

}
