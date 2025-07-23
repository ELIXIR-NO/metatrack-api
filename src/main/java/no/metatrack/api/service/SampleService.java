package no.metatrack.api.service;

import no.metatrack.api.dto.CreateSampleRequest;
import no.metatrack.api.dto.SampleResponse;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import no.metatrack.api.node.Assay;
import no.metatrack.api.node.Sample;
import no.metatrack.api.repository.AssayRepository;
import no.metatrack.api.repository.SampleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SampleService {

	private final AssayRepository assayRepository;

	private final SampleRepository sampleRepository;

	public SampleService(AssayRepository assayRepository, SampleRepository sampleRepository) {
		this.assayRepository = assayRepository;
		this.sampleRepository = sampleRepository;
	}

	@Transactional
	public SampleResponse createNewSample(String assayId, CreateSampleRequest request) {
		Assay assay = assayRepository.findById(assayId).orElseThrow();
		if (sampleRepository.existsByName(request.name()))
			throw new ResourceAlreadyExistsException("Sample already exists!");

		Sample newSample = Sample.builder()
			.name(request.name())
			.rawAttributes(request.rawAttributes())
			.assay(assay)
			.build();

		Sample savedSample = sampleRepository.save(newSample);

		return convertToSampleResponse(savedSample);
	}

	public SampleResponse getSampleById(String sampleId) {
		Sample sample = sampleRepository.findById(sampleId).orElseThrow();
		return convertToSampleResponse(sample);
	}

	public SampleResponse getSampleByName(String sampleName) {
		Sample sample = sampleRepository.findByName(sampleName).orElseThrow();
		return convertToSampleResponse(sample);
	}

	public List<SampleResponse> getAllSamples(String assayId) {
		Assay assay = assayRepository.findById(assayId).orElseThrow();
		return assay.getSample().stream().map(this::convertToSampleResponse).toList();
	}

	private SampleResponse convertToSampleResponse(Sample sample) {
		return new SampleResponse(sample.getName(), sample.getRawAttributes());
	}

}
