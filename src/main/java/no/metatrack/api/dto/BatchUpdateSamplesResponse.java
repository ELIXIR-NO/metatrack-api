package no.metatrack.api.dto;

import java.util.List;
import java.util.Map;

public record BatchUpdateSamplesResponse(List<SampleResponse> sampleResponses, List<Map<String, String>> errorIds) {
}
