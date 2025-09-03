import { describe, it, expect } from 'vitest';
import { calculateMonthlyPayment } from './mortgageCalculator';

describe('Mortgage Calculator - Annuity Formula', () => {
	describe('Basic Calculations', () => {
		it('should calculate monthly payment for standard mortgage', () => {
			// Test case: $200,000 loan, 5% annual interest, 30 years (360 payments)
			const principal = 200000;
			const annualInterestRate = 0.05;
			const numberOfPayments = 360;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			// Expected result: approximately $1073.64
			expect(result).toBeCloseTo(1073.64, 2);
		});

		it('should calculate monthly payment for 15-year mortgage', () => {
			// Test case: $150,000 loan, 4% annual interest, 15 years (180 payments)
			const principal = 150000;
			const annualInterestRate = 0.04;
			const numberOfPayments = 180;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			// Expected result: approximately $1109.53
			expect(result).toBeCloseTo(1109.53, 2);
		});

		it('should calculate monthly payment for higher interest rate', () => {
			// Test case: $100,000 loan, 8% annual interest, 30 years (360 payments)
			const principal = 100000;
			const annualInterestRate = 0.08;
			const numberOfPayments = 360;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			// Expected result: approximately $733.76
			expect(result).toBeCloseTo(733.76, 2);
		});
	});

	describe('Edge Cases', () => {
		it('should handle 0% interest rate correctly', () => {
			// Test case: $120,000 loan, 0% annual interest, 24 payments
			const principal = 120000;
			const annualInterestRate = 0;
			const numberOfPayments = 24;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			// With 0% interest, payment should simply be principal divided by number of payments
			expect(result).toBeCloseTo(principal / numberOfPayments, 2);
			expect(result).toBe(5000);
		});

		it('should handle 1-month duration', () => {
			// Test case: $50,000 loan, 6% annual interest, 1 payment
			const principal = 50000;
			const annualInterestRate = 0.06;
			const numberOfPayments = 1;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			// With 1 payment, should return principal plus one month of interest
			const expectedPayment = principal * (1 + annualInterestRate / 12);
			expect(result).toBeCloseTo(expectedPayment, 2);
			expect(result).toBeCloseTo(50250, 2);
		});

		it('should handle very small principal amount', () => {
			// Test case: $1 loan, 5% annual interest, 12 payments
			const principal = 1;
			const annualInterestRate = 0.05;
			const numberOfPayments = 12;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			expect(result).toBeCloseTo(0.0856, 4);
		});

		it('should handle very low interest rate', () => {
			// Test case: $100,000 loan, 0.01% annual interest, 360 payments
			const principal = 100000;
			const annualInterestRate = 0.0001;
			const numberOfPayments = 360;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			// Very low interest should be close to principal/payments
			expect(result).toBeCloseTo(278.2, 2);
		});
	});

	describe('Input Validation', () => {
		it('should throw error for negative principal', () => {
			expect(() => {
				calculateMonthlyPayment(-100000, 0.05, 360);
			}).toThrow('Principal must be non-negative');
		});

		it('should throw error for negative interest rate', () => {
			expect(() => {
				calculateMonthlyPayment(100000, -0.05, 360);
			}).toThrow('Interest rate must be non-negative');
		});

		it('should throw error for zero payments', () => {
			expect(() => {
				calculateMonthlyPayment(100000, 0.05, 0);
			}).toThrow('Number of payments must be positive');
		});

		it('should throw error for negative payments', () => {
			expect(() => {
				calculateMonthlyPayment(100000, 0.05, -12);
			}).toThrow('Number of payments must be positive');
		});

		it('should handle zero principal correctly', () => {
			const result = calculateMonthlyPayment(0, 0.05, 360);
			expect(result).toBe(0);
		});
	});

	describe('Formula Verification', () => {
		it('should verify annuity formula implementation', () => {
			// Manual calculation to verify the formula implementation
			const principal = 100000;
			const annualInterestRate = 0.06;
			const numberOfPayments = 360;
			const monthlyRate = annualInterestRate / 12;

			// Manual calculation: M = P * (r(1+r)^n) / ((1+r)^n - 1)
			const onePlusR = 1 + monthlyRate;
			const onePlusRToN = Math.pow(onePlusR, numberOfPayments);
			const expectedPayment = (principal * (monthlyRate * onePlusRToN)) / (onePlusRToN - 1);

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			expect(result).toBeCloseTo(expectedPayment, 10);
			expect(result).toBeCloseTo(599.55, 2);
		});

		it('should handle decimal precision correctly', () => {
			// Test with values that might cause floating point precision issues
			const principal = 199999.99;
			const annualInterestRate = 0.0499;
			const numberOfPayments = 359;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			expect(result).toBeGreaterThan(0);
			expect(Number.isFinite(result)).toBe(true);
			expect(result).toBeCloseTo(1073.71, 2);
		});
	});

	describe('Boundary Conditions', () => {
		it('should handle maximum typical mortgage values', () => {
			// Large mortgage: $1M loan, 7% annual interest, 30 years
			const principal = 1000000;
			const annualInterestRate = 0.07;
			const numberOfPayments = 360;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			expect(result).toBeCloseTo(6653.02, 2);
		});

		it('should handle minimum practical values', () => {
			// Small loan: $1000, 3% annual interest, 6 months
			const principal = 1000;
			const annualInterestRate = 0.03;
			const numberOfPayments = 6;

			const result = calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments);

			expect(result).toBeCloseTo(168.13, 2);
		});
	});
});
