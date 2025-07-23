package no.metatrack.api;

import jakarta.validation.ConstraintViolationException;
import no.metatrack.api.exceptions.ResourceAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

	public record ErrorDetails(LocalDateTime timestamp, String message, String details) {
	}

	public record ValidationErrorDetails(LocalDateTime timestamp, String message, String details,
			List<FieldError> fieldErrors) {
	}

	public record FieldError(String field, String message) {
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ValidationErrorDetails> handleHttpMessageNotReadableException(
			HttpMessageNotReadableException ex, WebRequest request) {

		List<FieldError> fieldErrors = List.of(new FieldError("body", "Request body is required"));

		ValidationErrorDetails errorDetails = new ValidationErrorDetails(LocalDateTime.now(), "Validation failed",
				request.getDescription(false), fieldErrors);

		return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ValidationErrorDetails> handleValidationExceptions(MethodArgumentNotValidException ex,
			WebRequest request) {
		List<FieldError> fieldErrors = new ArrayList<>();

		ex.getBindingResult()
			.getFieldErrors()
			.forEach(error -> fieldErrors.add(new FieldError(error.getField(), error.getDefaultMessage())));

		ValidationErrorDetails errorDetails = new ValidationErrorDetails(LocalDateTime.now(), "Validation failed",
				request.getDescription(false), fieldErrors);

		return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ValidationErrorDetails> handleConstraintViolationException(ConstraintViolationException ex,
			WebRequest request) {

		List<FieldError> fieldErrors = new ArrayList<>();
		ex.getConstraintViolations().forEach(violation -> {
			String fieldName = violation.getPropertyPath().toString();
			String message = violation.getMessage();
			fieldErrors.add(new FieldError(fieldName, message));
		});

		ValidationErrorDetails errorDetails = new ValidationErrorDetails(LocalDateTime.now(), "Validation failed",
				request.getDescription(false), fieldErrors);

		return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
		ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
				request.getDescription(false));
		return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(ResourceAlreadyExistsException.class)
	public ResponseEntity<ErrorDetails> handleResourceAlreadyExistsException(ResourceAlreadyExistsException ex,
			WebRequest request) {
		ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
				request.getDescription(false));
		return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
	}

}