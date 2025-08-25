package no.metatrack.api.service;

import no.metatrack.api.dto.NCBITaxonomyNode;
import no.metatrack.api.dto.NCBITaxonomyResponse;
import no.metatrack.api.pojo.Taxonomy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NCBIApiService {

	private final RestClient ncbiRestClient;

	public NCBIApiService(RestClient.Builder restClientBuilder) {
		ncbiRestClient = restClientBuilder.baseUrl("https://api.ncbi.nlm.nih.gov/datasets/v2")
			.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.build();
	}

	public List<Taxonomy> getMultipleTaxonomyData(List<String> taxIds) {
		Map<String, List<String>> requestBody = new HashMap<>();
		requestBody.put("taxons", taxIds);

		NCBITaxonomyResponse response = ncbiRestClient.post()
			.uri("/taxonomy")
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.body(requestBody)
			.retrieve()
			.body(NCBITaxonomyResponse.class);

		if (response != null && response.taxonomyNodes() != null) {
			return response.taxonomyNodes()
				.stream()
				.map(NCBITaxonomyNode::taxonomy)
				.filter(Objects::nonNull)
				.collect(Collectors.toList());
		}

		return List.of();

	}

	public Optional<Taxonomy> getTaxonomyData(String taxId) {
		List<Taxonomy> taxonomyList = getMultipleTaxonomyData(List.of(taxId));
		if (taxonomyList.isEmpty()) {
			return Optional.empty();
		}
		return Optional.ofNullable(taxonomyList.getFirst());
	}

}
