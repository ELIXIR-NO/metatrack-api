package no.metatrack.api.service;

import no.metatrack.api.dto.CreateInvestigationRequest;
import no.metatrack.api.dto.InvestigationResponse;
import no.metatrack.api.enums.InvestigationRole;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.node.User;
import no.metatrack.api.relations.InvestigationMember;
import no.metatrack.api.repository.InvestigationRepository;
import no.metatrack.api.repository.UserRepository;
import no.metatrack.api.utils.TextUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class InvestigationService {

	private final InvestigationRepository investigationRepository;

	private final UserRepository userRepository;

	public InvestigationService(InvestigationRepository investigationRepository, UserRepository userRepository) {
		this.investigationRepository = investigationRepository;
		this.userRepository = userRepository;
	}

	public InvestigationResponse createInvestigation(CreateInvestigationRequest request, String userEmail) {
		if (investigationRepository.existsByIdentifier(request.identifier())) {
			throw new ResourceAlreadyExistsException("Identifier is already in use!");
		}

		User user = userRepository.findByEmail(userEmail).orElseThrow();
		InvestigationMember owner = InvestigationMember.builder().user(user).role(InvestigationRole.OWNER).build();

		Investigation newInvestigation = Investigation.builder()
			.identifier(request.identifier())
			.title(request.title())
			.description(TextUtils.convertBlankStringToNull(request.description()))
			.filename(TextUtils.convertBlankStringToNull(request.filename()))
			.members(Set.of(owner))
			.build();

		Investigation savedInvestigation = investigationRepository.save(newInvestigation);

		return new InvestigationResponse(savedInvestigation.getId(), savedInvestigation.getIdentifier(),
				savedInvestigation.getTitle(), savedInvestigation.getDescription(), savedInvestigation.getFilename());

	}

	@Transactional
	public void addMemberToInvestigation(String investigationId, String userEmail, InvestigationRole role) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();

		User user = userRepository.findByEmail(userEmail).orElseThrow();

		InvestigationMember member = InvestigationMember.builder().user(user).role(role).build();

		Set<InvestigationMember> investigationMembers = investigation.getMembers();

		investigationMembers.add(member);
		investigationRepository.save(investigation);
	}

}
