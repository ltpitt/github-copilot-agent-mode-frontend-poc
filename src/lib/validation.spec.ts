import { describe, it, expect } from 'vitest';
import {
	validateFormInputs,
	validatePrincipal,
	validateInterestRate,
	validateDuration,
	validateBuyingType,
	validateEnergyLabel
} from './validation';

describe('Validation Functions', () => {
	describe('validatePrincipal', () => {
		it('should validate positive principal', () => {
			const result = validatePrincipal(300000);
			expect(result.isValid).toBe(true);
			expect(result.message).toBeUndefined();
		});

		it('should reject negative principal', () => {
			const result = validatePrincipal(-1000);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Income must be greater than 0');
		});

		it('should reject zero principal', () => {
			const result = validatePrincipal(0);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Income must be greater than 0');
		});

		it('should reject excessively high principal', () => {
			const result = validatePrincipal(20000000);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Income amount seems unreasonably high');
		});

		it('should reject invalid principal (NaN)', () => {
			const result = validatePrincipal(NaN);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Income amount is required');
		});
	});

	describe('validateInterestRate', () => {
		it('should validate positive interest rate', () => {
			const result = validateInterestRate(3.5);
			expect(result.isValid).toBe(true);
			expect(result.message).toBeUndefined();
		});

		it('should validate zero interest rate', () => {
			const result = validateInterestRate(0);
			expect(result.isValid).toBe(true);
			expect(result.message).toBeUndefined();
		});

		it('should reject negative interest rate', () => {
			const result = validateInterestRate(-5);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Interest rate cannot be negative');
		});

		it('should reject excessively high interest rate', () => {
			const result = validateInterestRate(60);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Interest rate cannot exceed 50%');
		});

		it('should reject invalid interest rate (NaN)', () => {
			const result = validateInterestRate(NaN);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Interest rate is required');
		});
	});

	describe('validateDuration', () => {
		it('should validate positive duration', () => {
			const result = validateDuration(30);
			expect(result.isValid).toBe(true);
			expect(result.message).toBeUndefined();
		});

		it('should reject zero duration', () => {
			const result = validateDuration(0);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Duration must be greater than 0 years');
		});

		it('should reject negative duration', () => {
			const result = validateDuration(-5);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Duration must be greater than 0 years');
		});

		it('should reject non-integer duration', () => {
			const result = validateDuration(15.5);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Duration must be a whole number of years');
		});

		it('should reject excessively high duration', () => {
			const result = validateDuration(60);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Duration cannot exceed 50 years');
		});

		it('should reject invalid duration (NaN)', () => {
			const result = validateDuration(NaN);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Duration is required');
		});
	});

	describe('validateBuyingType', () => {
		it('should validate when buying alone (true)', () => {
			const result = validateBuyingType(true);
			expect(result.isValid).toBe(true);
			expect(result.message).toBeUndefined();
		});

		it('should validate when buying together (false)', () => {
			const result = validateBuyingType(false);
			expect(result.isValid).toBe(true);
			expect(result.message).toBeUndefined();
		});

		it('should reject when value is null', () => {
			const result = validateBuyingType(null);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('You have not answered the question. This is mandatory.');
		});

		it('should reject when value is undefined', () => {
			const result = validateBuyingType(undefined);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('You have not answered the question. This is mandatory.');
		});
	});

	describe('validateFormInputs', () => {
		it('should validate all valid inputs including buying type and energy label', () => {
			const result = validateFormInputs(300000, 3.5, 30, true, 'C');
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
		});

		it('should validate with buying alone false and energy label', () => {
			const result = validateFormInputs(300000, 3.5, 30, false, 'B');
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
		});

		it('should fail validation when buying type is not provided', () => {
			const result = validateFormInputs(300000, 3.5, 30);
			expect(result.isValid).toBe(false);
			expect(result.errors.buyingType).toBe(
				'You have not answered the question. This is mandatory.'
			);
			expect(result.errors.energyLabel).toBe('Energy label is required');
		});

		it('should fail validation when buying type is explicitly null', () => {
			const result = validateFormInputs(300000, 3.5, 30, null);
			expect(result.isValid).toBe(false);
			expect(result.errors.buyingType).toBe(
				'You have not answered the question. This is mandatory.'
			);
		});

		it('should return multiple errors for invalid inputs', () => {
			const result = validateFormInputs(-1000, -1, 0, true, 'X' as any);
			expect(result.isValid).toBe(false);
			expect(result.errors.principal).toBe('Income must be greater than 0');
			expect(result.errors.interestRate).toBe('Interest rate cannot be negative');
			expect(result.errors.duration).toBe('Duration must be greater than 0 years');
			expect(result.errors.energyLabel).toBe('Energy label must be A, B, C, D, E, F, or G');
			expect(result.errors.buyingType).toBeUndefined();
		});

		it('should return single error when only one field is invalid', () => {
			const result = validateFormInputs(-5000, 4.5, 25, false, 'A');
			expect(result.isValid).toBe(false);
			expect(result.errors.principal).toBe('Income must be greater than 0');
			expect(result.errors.interestRate).toBeUndefined();
			expect(result.errors.duration).toBeUndefined();
			expect(result.errors.buyingType).toBeUndefined();
			expect(result.errors.energyLabel).toBeUndefined();
		});

		it('should handle edge case values with valid buying type and energy label', () => {
			const result = validateFormInputs(1, 0, 1, true, 'G');
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
		});
	});

	describe('validateEnergyLabel', () => {
		it('should validate all valid energy labels', () => {
			const validLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
			validLabels.forEach(label => {
				const result = validateEnergyLabel(label as any);
				expect(result.isValid).toBe(true);
				expect(result.message).toBeUndefined();
			});
		});

		it('should reject null energy label', () => {
			const result = validateEnergyLabel(null);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Energy label is required');
		});

		it('should reject undefined energy label', () => {
			const result = validateEnergyLabel(undefined);
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('Energy label is required');
		});

		it('should reject invalid energy labels', () => {
			const invalidLabels = ['H', 'X', '1', 'a', 'AA', ''];
			invalidLabels.forEach(label => {
				const result = validateEnergyLabel(label as any);
				expect(result.isValid).toBe(false);
				expect(result.message).toBe('Energy label must be A, B, C, D, E, F, or G');
			});
		});
	});
});
