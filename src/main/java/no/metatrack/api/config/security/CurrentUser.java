package no.metatrack.api.config.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

	public String getSubject() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null)
			return null;

		Object principal = auth.getPrincipal();
		if (principal instanceof Jwt jwt) {
			return jwt.getClaimAsString("sub");
		}

		return null;
	}

}
