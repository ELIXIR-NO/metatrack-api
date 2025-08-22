package no.metatrack.api.service;

import no.metatrack.api.dto.CreateInvestigationRequest;
import no.metatrack.api.dto.InvestigationResponse;
import no.metatrack.api.dto.UpdateInvestigationRequest;
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

import java.util.List;
import java.util.Set;

@Service
public class InvestigationService {

	private final InvestigationRepository investigationRepository;

	private final UserRepository userRepository;

	public InvestigationService(InvestigationRepository investigationRepository, UserRepository userRepository) {
		this.investigationRepository = investigationRepository;
		this.userRepository = userRepository;
	}

	public InvestigationResponse createInvestigation(CreateInvestigationRequest request, String userId) {
		if (investigationRepository.existsByIdentifier(request.identifier())) {
			throw new ResourceAlreadyExistsException("Identifier is already in use!");
		}

		User user = userRepository.findById(userId).orElseThrow();
		InvestigationMember owner = InvestigationMember.builder().user(user).role(InvestigationRole.OWNER).build();

		Investigation newInvestigation = Investigation.builder()
			.identifier(request.identifier())
			.title(request.title())
			.description(TextUtils.convertBlankStringToNull(request.description()))
			.filename(TextUtils.convertBlankStringToNull(request.filename()))
			.members(Set.of(owner))
			.build();

		Investigation savedInvestigation = investigationRepository.save(newInvestigation);

		return convertToInvestigationResponse(savedInvestigation);

	}

	@Transactional
	public void addMemberToInvestigation(String investigationId, String userId, InvestigationRole role) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();

		User user = userRepository.findById(userId).orElseThrow();

		InvestigationMember member = InvestigationMember.builder().user(user).role(role).build();

		Set<InvestigationMember> investigationMembers = investigation.getMembers();

		investigationMembers.add(member);
		investigationRepository.save(investigation);
	}

	public List<InvestigationResponse> getAllInvestigations() {
		List<Investigation> investigations = investigationRepository.findAll();
		return investigations.stream().map(this::convertToInvestigationResponse).toList();
	}

	private InvestigationResponse convertToInvestigationResponse(Investigation investigation) {
		return new InvestigationResponse(investigation.getId(), investigation.getIdentifier(), investigation.getTitle(),
				investigation.getDescription(), investigation.getFilename());
	}

	public InvestigationResponse getInvestigationById(String investigationId) {
		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();
		return convertToInvestigationResponse(investigation);
	}

	public InvestigationResponse updateInvestigation(UpdateInvestigationRequest request, String investigationId) {
		boolean checkInvestigation = investigationRepository.existsByIdentifier(request.identifier());
		if (checkInvestigation) {
			throw new ResourceAlreadyExistsException("Identifier is already in use!");
		}

		Investigation investigation = investigationRepository.findById(investigationId).orElseThrow();
		if (request.identifier() != null) {
			investigation.setIdentifier(request.identifier().trim());
		}
		if (request.title() != null) {
			investigation.setTitle(request.title().trim());
		}
		if (request.description() != null) {
			investigation.setDescription(request.description().trim());
		}
		if (request.filename() != null) {
			investigation.setFilename(request.filename().trim());
		}

		Investigation savedInvestigation = investigationRepository.save(investigation);
		return convertToInvestigationResponse(savedInvestigation);
	}

}
