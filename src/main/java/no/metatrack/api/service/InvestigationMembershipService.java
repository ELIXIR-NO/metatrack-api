package no.metatrack.api.service;

import jakarta.validation.Valid;
import no.metatrack.api.enums.InvestigationRole;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.User;
import no.metatrack.api.relations.InvestigationMember;
import no.metatrack.api.repository.InvestigationRepository;
import no.metatrack.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InvestigationMembershipService {

	private final InvestigationRepository investigationRepository;

	private final UserRepository userRepository;

	public InvestigationMembershipService(InvestigationRepository investigationRepository,
			UserRepository userRepository) {
		this.investigationRepository = investigationRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public void addNewMember(String investigationId, String userId, InvestigationRole role) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();
		User user = userRepository.findById(userId).orElseThrow();

		if (isUserMemberOfInvestigation(investigation, userId)) {
			throw new ResourceAlreadyExistsException("User is already member of investigation");
		}

		InvestigationMember member = InvestigationMember.builder().user(user).role(role).build();
		investigation.getMembers().add(member);
		investigationRepository.save(investigation);
	}

	@Transactional
	public void modifyMemberRole(String investigationId, String userId, @Valid InvestigationRole role) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();

		InvestigationMember member = investigation.getMembers()
			.stream()
			.filter(m -> m.getUser().getId().equals(userId))
			.findFirst()
			.orElseThrow(() -> new IllegalStateException("User is not member of investigation"));

		member.setRole(role);

		investigationRepository.save(investigation);

	}

	private boolean isUserMemberOfInvestigation(Investigation investigation, String userId) {
		return investigation.getMembers().stream().anyMatch(member -> member.getUser().getId().equals(userId));
	}

}
