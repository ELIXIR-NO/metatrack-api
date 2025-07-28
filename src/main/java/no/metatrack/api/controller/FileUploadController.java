package no.metatrack.api.controller;

import no.metatrack.api.service.SampleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

	private final SampleService sampleService;

	public FileUploadController(SampleService sampleService) {
		this.sampleService = sampleService;
	}

	@PostMapping("/sample")
	public ResponseEntity<Void> uploadSample(@RequestParam("file") MultipartFile file) {

		String assayId = "426d1952-577f-455e-970f-f14661857f27";

		sampleService.uploadSampleTable(assayId, file);

		return ResponseEntity.ok().build();
	}

}
