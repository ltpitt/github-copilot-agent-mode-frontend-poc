/**
 * Validation utility functions for mortgage calculator input
 */

export interface ValidationResult {
	isValid: boolean;
	message?: string;
}

/**
 * Validates principal amount (gross annual income)
 */
export function validatePrincipal(value: number): ValidationResult {
	if (isNaN(value) || value === null || value === undefined) {
		return { isValid: false, message: 'Income amount is required' };
	}
	if (value <= 0) {
		return { isValid: false, message: 'Income must be greater than 0' };
	}
	if (value > 10000000) {
		return { isValid: false, message: 'Income amount seems unreasonably high' };
	}
	return { isValid: true };
}

/**
 * Validates annual interest rate
 */
export function validateInterestRate(value: number): ValidationResult {
	if (isNaN(value) || value === null || value === undefined) {
		return { isValid: false, message: 'Interest rate is required' };
	}
	if (value < 0) {
		return { isValid: false, message: 'Interest rate cannot be negative' };
	}
	if (value > 50) {
		return { isValid: false, message: 'Interest rate cannot exceed 50%' };
	}
	return { isValid: true };
}

/**
 * Validates loan duration in years
 */
export function validateDuration(value: number): ValidationResult {
	if (isNaN(value) || value === null || value === undefined) {
		return { isValid: false, message: 'Duration is required' };
	}
	if (value <= 0) {
		return { isValid: false, message: 'Duration must be greater than 0 years' };
	}
	if (!Number.isInteger(value)) {
		return { isValid: false, message: 'Duration must be a whole number of years' };
	}
	if (value > 50) {
		return { isValid: false, message: 'Duration cannot exceed 50 years' };
	}
	return { isValid: true };
}

/**
 * Validates buying type selection (alone or together)
 */
export function validateBuyingType(value: boolean | null | undefined): ValidationResult {
	if (value === null || value === undefined) {
		return { isValid: false, message: 'You have not answered the question. This is mandatory.' };
	}
	return { isValid: true };
}

/**
 * Validates all form inputs at once
 */
export function validateFormInputs(
	principal: number,
	interestRate: number,
	duration: number,
	buyingAlone?: boolean | null
): {
	isValid: boolean;
	errors: {
		principal?: string;
		interestRate?: string;
		duration?: string;
		buyingType?: string;
	};
} {
	const principalResult = validatePrincipal(principal);
	const interestResult = validateInterestRate(interestRate);
	const durationResult = validateDuration(duration);
	const buyingTypeResult = validateBuyingType(buyingAlone);

	return {
		isValid:
			principalResult.isValid &&
			interestResult.isValid &&
			durationResult.isValid &&
			buyingTypeResult.isValid,
		errors: {
			...(principalResult.message && { principal: principalResult.message }),
			...(interestResult.message && { interestRate: interestResult.message }),
			...(durationResult.message && { duration: durationResult.message }),
			...(buyingTypeResult.message && { buyingType: buyingTypeResult.message })
		}
	};
}
