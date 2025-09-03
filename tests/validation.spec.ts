import { describe, it, expect } from 'vitest';
import { validateFormInputs, validatePrincipal, validateInterestRate, validateDuration } from '../src/lib/validation';

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

	describe('validateFormInputs', () => {
		it('should validate all valid inputs', () => {
			const result = validateFormInputs(300000, 3.5, 30);
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
		});

		it('should return multiple errors for invalid inputs', () => {
			const result = validateFormInputs(-1000, -1, 0);
			expect(result.isValid).toBe(false);
			expect(result.errors.principal).toBe('Income must be greater than 0');
			expect(result.errors.interestRate).toBe('Interest rate cannot be negative');
			expect(result.errors.duration).toBe('Duration must be greater than 0 years');
		});

		it('should return single error when only one field is invalid', () => {
			const result = validateFormInputs(-5000, 4.5, 25);
			expect(result.isValid).toBe(false);
			expect(result.errors.principal).toBe('Income must be greater than 0');
			expect(result.errors.interestRate).toBeUndefined();
			expect(result.errors.duration).toBeUndefined();
		});

		it('should handle edge case values', () => {
			const result = validateFormInputs(1, 0, 1);
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
		});
	});
});