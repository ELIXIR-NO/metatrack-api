package no.metatrack.api.service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.*;
import jakarta.validation.Valid;
import no.metatrack.api.dto.*;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import no.metatrack.api.node.*;
import no.metatrack.api.repository.*;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class SampleService {

	private final AssayRepository assayRepository;

	private final SampleRepository sampleRepository;

	private final MinioClient minioClient;

	private final String bucket;

	private final SampleAttributeRepository sampleAttributeRepository;

	private final FactorValueRepository factorValueRepository;

	private final MaterialAttributeValueRepository materialAttributeValueRepository;

	public SampleService(AssayRepository assayRepository, SampleRepository sampleRepository, MinioClient minioClient,
			@Value("${minio.bucket}") String bucket, SampleAttributeRepository sampleAttributeRepository,
			FactorValueRepository factorValueRepository,
			MaterialAttributeValueRepository materialAttributeValueRepository) {
		this.assayRepository = assayRepository;
		this.sampleRepository = sampleRepository;
		this.minioClient = minioClient;
		this.bucket = bucket;
		this.sampleAttributeRepository = sampleAttributeRepository;
		this.factorValueRepository = factorValueRepository;
		this.materialAttributeValueRepository = materialAttributeValueRepository;
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
		return new SampleResponse(sample.getId(), sample.getName(), sample.getRawAttributes(),
				convertMaterialAttributeValues(sample.getCharacteristics()),
				convertFactorValues(sample.getFactorValues()), convertSources(sample.getDerivedFrom()));

	}

	private Collection<SimpleMaterialAttributeValueResponse> convertMaterialAttributeValues(
			Collection<MaterialAttributeValue> materialAttributeValues) {
		if (materialAttributeValues == null)
			return null;

		return materialAttributeValues.stream().map(this::convertMaterialAttributeValue).toList();
	}

	private SimpleMaterialAttributeValueResponse convertMaterialAttributeValue(MaterialAttributeValue mav) {
		return new SimpleMaterialAttributeValueResponse(mav.getId(), convertMaterialAttribute(mav.getCategory()),
				convertOntologyAnnotation(mav.getUnit()), mav.getValue());
	}

	private SimpleMaterialAttributeResponse convertMaterialAttribute(MaterialAttribute ma) {
		if (ma == null)
			return null;

		return new SimpleMaterialAttributeResponse(ma.getId(), convertOntologyAnnotation(ma.getCharacteristicType()));
	}

	private Collection<SimpleFactorValueResponse> convertFactorValues(Collection<FactorValue> factorValues) {
		if (factorValues == null)
			return null;

		return factorValues.stream().map(this::convertFactorValue).toList();
	}

	private SimpleFactorValueResponse convertFactorValue(FactorValue fv) {
		return new SimpleFactorValueResponse(fv.getId(), convertFactor(fv.getCategory()),
				convertOntologyAnnotation(fv.getUnit()), fv.getValue());
	}

	private SimpleFactorResponse convertFactor(Factor factor) {
		if (factor == null)
			return null;

		return new SimpleFactorResponse(factor.getId(), factor.getFactorName(),
				convertOntologyAnnotation(factor.getFactorType()));
	}

	private Collection<SimpleSourceResponse> convertSources(Collection<Source> sources) {
		if (sources == null)
			return null;

		return sources.stream().map(this::convertSource).toList();
	}

	private SimpleSourceResponse convertSource(Source source) {
		return new SimpleSourceResponse(source.getId(), source.getName(),
				convertMaterialAttributeValues(source.getCharacteristics()));
	}

	private SimpleOntologyAnnotationResponse convertOntologyAnnotation(OntologyAnnotation oa) {
		if (oa == null)
			return null;

		return new SimpleOntologyAnnotationResponse(oa.getId(), oa.getTermAccession(), oa.getAnnotationValue());
	}

	@Transactional
	public void uploadSampleTable(String assayId, MultipartFile file) {
		String objectName = UUID.randomUUID() + "-" + file.getOriginalFilename();
		List<Sample> samples = new ArrayList<>();
		try {
			minioClient.putObject(PutObjectArgs.builder()
				.object(objectName)
				.bucket(bucket)
				.stream(file.getInputStream(), file.getSize(), -1)
				.contentType(file.getContentType())
				.build());

			try (InputStream in = minioClient
				.getObject(GetObjectArgs.builder().bucket(bucket).object(objectName).build());
					Reader reader = new InputStreamReader(in);
					CSVParser parser = CSVFormat.DEFAULT.builder()
						.setDelimiter('\t')
						.setHeader()
						.setSkipHeaderRecord(true)
						.setAllowMissingColumnNames(true)
						.setIgnoreEmptyLines(true)
						.setTrim(true)
						.get()
						.parse(reader)) {

				List<CSVRecord> records = new ArrayList<>(parser.getRecords());

				Assay assay = assayRepository.findById(assayId).orElseThrow();

				for (CSVRecord record : records) {
					List<SampleAttribute> rawAttributes = new ArrayList<>();

					for (String columnName : parser.getHeaderNames()) {
						String value = null;
						try {
							if (record.isMapped(columnName)) {
								value = record.get(columnName);
							}
						}
						catch (IllegalArgumentException e) {
							continue;
						}

						if (value != null && !value.isBlank()) {
							SampleAttribute attribute = SampleAttribute.builder().name(columnName).value(value).build();
							rawAttributes.add(attribute);
						}
					}

					String sampleName = null;
					try {
						if (record.isMapped("sample_alias")) {
							sampleName = record.get("sample_alias");
						}
					}
					catch (IllegalArgumentException e) {
						throw new RuntimeException("Required 'sample_alias' column not found in CSV");

					}

					if (sampleName != null && !sampleName.isBlank()) {
						Sample sample = Sample.builder()
							.name(sampleName)
							.rawAttributes(rawAttributes)
							.assay(assay)
							.build();
						samples.add(sample);
					}
				}

				sampleRepository.saveAll(samples);
			}
		}
		catch (ServerException | InsufficientDataException | ErrorResponseException | IOException
				| NoSuchAlgorithmException | InvalidKeyException | InvalidResponseException | XmlParserException
				| InternalException e) {
			throw new RuntimeException(e);
		}
	}

	@Transactional
	public void curateRawAttribute(String sampleId, String rawAttributeId, Factor factor, OntologyAnnotation unit,
			Object value) {
		Sample sample = sampleRepository.findById(sampleId).orElseThrow();
		SampleAttribute rawAttribute = sampleAttributeRepository.findById(rawAttributeId).orElseThrow();

		FactorValue factorValue = new FactorValue();
		factorValue.setCategory(factor);
		factorValue.setUnit(unit);
		factorValue.setValue(value);

		FactorValue savedFactorValue = factorValueRepository.save(factorValue);
		List<FactorValue> sampleFactorValues = sample.getFactorValues();
		sampleFactorValues.add(savedFactorValue);

		sample.setFactorValues(sampleFactorValues);
		sample.getRawAttributes().remove(rawAttribute);

		sampleAttributeRepository.delete(rawAttribute);

		sampleRepository.save(sample);
	}

	@Transactional
	public void curateRawAttribute(String sampleId, String rawAttributeId, MaterialAttribute materialAttribute,
			OntologyAnnotation unit, Object value) {
		Sample sample = sampleRepository.findById(sampleId).orElseThrow();
		SampleAttribute rawAttribute = sampleAttributeRepository.findById(rawAttributeId).orElseThrow();

		MaterialAttributeValue materialAttributeValue = new MaterialAttributeValue();
		materialAttributeValue.setCategory(materialAttribute);
		materialAttributeValue.setUnit(unit);
		materialAttributeValue.setValue(value);

		MaterialAttributeValue savedMaterialAttributeValue = materialAttributeValueRepository
			.save(materialAttributeValue);
		List<MaterialAttributeValue> characteristics = sample.getCharacteristics();
		characteristics.add(savedMaterialAttributeValue);

		sample.setCharacteristics(characteristics);
		sample.getRawAttributes().remove(rawAttribute);

		sampleAttributeRepository.delete(rawAttribute);

		sampleRepository.save(sample);
	}

	public void deleteSampleById(String sampleId) {
		sampleRepository.findById(sampleId).orElseThrow();
		sampleRepository.deleteSampleAndAttributes(sampleId);
	}

	@Transactional
	public void updateSampleById(String sampleId, @Valid UpdateSampleRequest request) {
		Sample sample = sampleRepository.findById(sampleId).orElseThrow();

		if (!sample.getName().equals(request.name()) && sampleRepository.existsByName(request.name())) {
			throw new ResourceAlreadyExistsException("Sample with name " + request.name() + " already exists!");
		}

		List<SampleAttribute> rawAttributes = request.rawAttributes()
			.stream()
			.map(attr -> SampleAttribute.builder().name(attr.attributeName()).value(attr.value()).build())
			.toList();

		sample.setName(request.name());
		sample.setRawAttributes(rawAttributes);

		sampleRepository.save(sample);
	}

	@Transactional
	public BatchUpdateSamplesResponse batchUpdate(@Valid BatchUpdateSamplesRequest request) {
		List<SampleResponse> updatedSamples = new ArrayList<>();
		List<Map<String, String>> errors = new ArrayList<>();

		for (BatchUpdateSamplesRequest.UpdateSampleRequestWithIdField sampleData : request.sampleData()) {
			try {
				Sample sample = sampleRepository.findById(sampleData.id()).orElse(null);

				if (sample == null) {
					errors.add(Map.of(sampleData.id(), "Sample not found"));
					continue;
				}

				if (!sample.getName().equals(sampleData.updateSampleRequest().name())
						&& sampleRepository.existsByName(sampleData.updateSampleRequest().name())) {
					errors.add(Map.of(sample.getId(), sampleData.updateSampleRequest().name() + " already exists"));
					continue;
				}

				List<SampleAttribute> rawAttributes = sampleData.updateSampleRequest()
					.rawAttributes()
					.stream()
					.map(attr -> SampleAttribute.builder().name(attr.attributeName()).value(attr.value()).build())
					.toList();

				sample.setName(sampleData.updateSampleRequest().name());
				sample.setRawAttributes(rawAttributes);

				Sample savedSample = sampleRepository.save(sample);
				updatedSamples.add(convertToSampleResponse(savedSample));
			}
			catch (Exception e) {
				errors.add(Map.of(sampleData.id(), e.getMessage()));
			}
		}

		return new BatchUpdateSamplesResponse(updatedSamples, errors);
	}

	public void batchDeleteSamplesByIds(List<String> sampleIds) {
		List<String> errors = new ArrayList<>();
		for (String sampleId : sampleIds) {
			try {
				Sample sample = sampleRepository.findById(sampleId).orElse(null);

				if (sample != null) {
					sampleRepository.deleteSampleAndAttributes(sampleId);
				}
				else {
					errors.add(sampleId);
				}
			}
			catch (Exception e) {
				errors.add(sampleId);
			}
		}

		if (!errors.isEmpty()) {
			throw new RuntimeException("Failed to delete samples: " + String.join(", ", errors));
		}
	}

}
