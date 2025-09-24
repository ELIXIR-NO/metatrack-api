package no.metatrack.api.dto;

import java.util.List;

public record BatchUpdateSamplesRequest(List<UpdateSampleRequestWithIdField> sampleData) {

	public record UpdateSampleRequestWithIdField(String id, UpdateSampleRequest updateSampleRequest) {

	}
}
