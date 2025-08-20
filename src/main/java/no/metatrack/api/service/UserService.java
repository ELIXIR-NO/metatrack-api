package no.metatrack.api.service;

import no.metatrack.api.dto.InvestigationResponse;
import no.metatrack.api.node.Investigation;
import no.metatrack.api.repository.InvestigationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

	private final InvestigationRepository investigationRepository;

	public UserService(InvestigationRepository investigationRepository) {
		this.investigationRepository = investigationRepository;
	}

	@Transactional(readOnly = true)
	public List<InvestigationResponse> getAllInvestigations(String userId) {
		return investigationRepository.findAllByUserId(userId)
			.stream()
			.map(this::convertToInvestigationResponse)
			.toList();
	}

	private InvestigationResponse convertToInvestigationResponse(Investigation investigation) {
		return new InvestigationResponse(investigation.getId(), investigation.getIdentifier(), investigation.getTitle(),
				investigation.getDescription(), investigation.getFilename());
	}

}
