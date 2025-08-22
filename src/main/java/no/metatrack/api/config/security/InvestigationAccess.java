package no.metatrack.api.config.security;

import lombok.RequiredArgsConstructor;
import no.metatrack.api.enums.InvestigationRole;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.User;
import no.metatrack.api.relations.InvestigationMember;
import no.metatrack.api.repository.InvestigationRepository;
import no.metatrack.api.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("investigationAccess")
@RequiredArgsConstructor
public class InvestigationAccess {

	private final CurrentUser currentUser;

	private final UserRepository userRepository;

	private final InvestigationRepository investigationRepository;

	@Transactional(readOnly = true)
	public boolean hasAtLeast(String investigationId, InvestigationRole requiredRole) {
		String sub = currentUser.getSubject();
		if (sub == null)
			return false;

		User user = userRepository.findById(sub).orElse(null);
		if (user == null)
			return false;

		Investigation investigation = investigationRepository.findById(investigationId).orElse(null);
		if (investigation == null)
			return false;

		InvestigationMember member = investigation.getMembers()
			.stream()
			.filter(m -> m.getUser().getId().equals(user.getId()))
			.findFirst()
			.orElse(null);
		if (member == null)
			return false;

		return hasAtLeastOrdered(member.getRole(), requiredRole);
	}

	private boolean hasAtLeastOrdered(InvestigationRole actualRole, InvestigationRole requiredRole) {
		return rank(actualRole) >= rank(requiredRole);
	}

	private int rank(InvestigationRole role) {
		return switch (role) {
			case OWNER -> 4;
			case ADMIN -> 3;
			case WRITER -> 2;
			case READER -> 1;
		};
	}

	@Transactional(readOnly = true)
	public boolean isOwner(String investigationId) {
		return hasAtLeast(investigationId, InvestigationRole.OWNER);
	}

	@Transactional(readOnly = true)
	public boolean isAdmin(String investigationId) {
		return hasAtLeast(investigationId, InvestigationRole.ADMIN);
	}

	@Transactional(readOnly = true)
	public boolean isWriter(String investigationId) {
		return hasAtLeast(investigationId, InvestigationRole.WRITER);
	}

	@Transactional(readOnly = true)
	public boolean isReader(String investigationId) {
		return hasAtLeast(investigationId, InvestigationRole.READER);
	}

}
