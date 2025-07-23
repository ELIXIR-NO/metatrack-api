package no.metatrack.api.utils;

import java.util.Optional;

public class TextUtils {

	/**
	 * Converts an empty or blank string to {@code null}. If the provided string has text,
	 * it is returned as-is. This method is useful for normalizing empty or blank strings
	 * when a {@code null} value is preferred.
	 * @param str the input string to be checked and possibly converted to {@code null}
	 * @return the original string if it contains text, or {@code null} if the string is
	 * {@code null}, empty, or blank
	 */
	public static String convertBlankStringToNull(String str) {
		return Optional.ofNullable(str).filter(org.springframework.util.StringUtils::hasText).orElse(null);
	}

}
