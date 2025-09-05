import { describe, it, expect } from 'vitest';
import {
	calculateMonthlyPayment,
	calculateEnergyLabelAdjustment,
	calculateMortgageWithEnergyLabel
} from './mortgageCalculator';

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

describe('Energy Label Mortgage Calculator - 2025 Regulations', () => {
	describe('Energy Label Adjustments', () => {
		it('should add €10,000 for A-label homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('A', 50000);
			expect(adjustment).toBe(10000);
		});

		it('should add €10,000 for B-label homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('B', 75000);
			expect(adjustment).toBe(10000);
		});

		it('should not adjust for C-label homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('C', 60000);
			expect(adjustment).toBe(0);
		});

		it('should not adjust for D-label homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('D', 80000);
			expect(adjustment).toBe(0);
		});

		it('should reduce €5,500 for E-label homes with income 40k-50k', () => {
			const adjustment = calculateEnergyLabelAdjustment('E', 45000);
			expect(adjustment).toBe(-5500);
		});

		it('should reduce €5,500 for F-label homes with income exactly 40k', () => {
			const adjustment = calculateEnergyLabelAdjustment('F', 40000);
			expect(adjustment).toBe(-5500);
		});

		it('should reduce €5,500 for G-label homes with income exactly 50k', () => {
			const adjustment = calculateEnergyLabelAdjustment('G', 50000);
			expect(adjustment).toBe(-5500);
		});

		it('should reduce more for higher income E-label homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('E', 100000);
			expect(adjustment).toBe(-17750); // -5500 + (-24500 * 0.5)
		});

		it('should reduce maximum €30,000 for highest income inefficient homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('G', 200000);
			expect(adjustment).toBe(-30000); // Cap at €30k
		});

		it('should reduce €5,500 for low income inefficient homes', () => {
			const adjustment = calculateEnergyLabelAdjustment('F', 35000);
			expect(adjustment).toBe(-5500);
		});
	});

	describe('Complete Mortgage Calculation with Energy Labels', () => {
		it('should calculate mortgage for A-label home correctly', () => {
			const result = calculateMortgageWithEnergyLabel(
				75000, // income
				400000, // home value
				'A', // energy label
				0.035, // 3.5% interest
				30 // 30 years
			);

			expect(result.baseCapacity).toBe(337500); // 75k * 4.5
			expect(result.energyLabelAdjustment).toBe(10000);
			expect(result.revisedCapacity).toBe(347500);
			expect(result.finalLoanAmount).toBe(347500); // Below appraised value
			expect(result.outOfPocket).toBe(52500); // 400k - 347.5k
			expect(result.energyLabel).toBe('A');
			expect(result.monthlyPayment).toBeCloseTo(1560.43, 2);
		});

		it('should respect appraised value constraint', () => {
			const result = calculateMortgageWithEnergyLabel(
				100000, // high income
				400000, // home value
				'B', // energy label
				0.04, // 4% interest
				25, // 25 years
				380000 // lower appraised value
			);

			expect(result.baseCapacity).toBe(450000);
			expect(result.energyLabelAdjustment).toBe(10000);
			expect(result.revisedCapacity).toBe(460000);
			expect(result.finalLoanAmount).toBe(380000); // Capped by appraisal
			expect(result.outOfPocket).toBe(20000); // 400k - 380k
		});

		it('should handle the example scenario from requirements', () => {
			// Assuming income that gives 375k capacity at 4.5x multiplier
			const income = 375000 / 4.5; // ~83,333
			const result = calculateMortgageWithEnergyLabel(
				income,
				400000, // home value
				'B', // energy label
				0.035, // interest rate
				30, // duration
				375000 // appraised value
			);

			expect(result.baseCapacity).toBeCloseTo(375000, 0);
			expect(result.energyLabelAdjustment).toBe(10000);
			expect(result.revisedCapacity).toBeCloseTo(385000, 0);
			expect(result.finalLoanAmount).toBe(375000); // Capped by appraisal
			expect(result.outOfPocket).toBe(25000);
		});

		it('should calculate reduction for high-income G-label home', () => {
			const result = calculateMortgageWithEnergyLabel(
				100000, // income
				500000, // home value
				'G', // worst energy label
				0.04, // 4% interest
				30 // 30 years
			);

			expect(result.baseCapacity).toBe(450000);
			expect(result.energyLabelAdjustment).toBe(-17750); // Scaled reduction
			expect(result.revisedCapacity).toBe(432250);
			expect(result.finalLoanAmount).toBe(432250);
			expect(result.outOfPocket).toBe(67750);
		});

		it('should handle income-based E-label reduction correctly', () => {
			const result = calculateMortgageWithEnergyLabel(
				45000, // income in 40-50k range
				300000, // home value
				'E', // inefficient label
				0.035, // 3.5% interest
				25 // 25 years
			);

			expect(result.baseCapacity).toBe(202500); // 45k * 4.5
			expect(result.energyLabelAdjustment).toBe(-5500);
			expect(result.revisedCapacity).toBe(197000);
			expect(result.finalLoanAmount).toBe(197000);
			expect(result.outOfPocket).toBe(103000);
		});

		it('should handle zero out-of-pocket when loan exceeds home value', () => {
			const result = calculateMortgageWithEnergyLabel(
				200000, // very high income
				300000, // lower home value
				'A', // excellent energy label
				0.03, // low interest
				30 // 30 years
			);

			expect(result.baseCapacity).toBe(900000);
			expect(result.energyLabelAdjustment).toBe(10000);
			expect(result.revisedCapacity).toBe(910000);
			expect(result.finalLoanAmount).toBe(300000); // Capped by home value (appraised)
			expect(result.outOfPocket).toBe(0); // No negative out-of-pocket
		});
	});

	describe('Input Validation for Energy Label Calculator', () => {
		it('should throw error for negative income', () => {
			expect(() => {
				calculateMortgageWithEnergyLabel(-50000, 300000, 'C', 0.04, 30);
			}).toThrow('Income must be positive');
		});

		it('should throw error for negative home value', () => {
			expect(() => {
				calculateMortgageWithEnergyLabel(50000, -300000, 'C', 0.04, 30);
			}).toThrow('Home value must be positive');
		});

		it('should throw error for negative interest rate', () => {
			expect(() => {
				calculateMortgageWithEnergyLabel(50000, 300000, 'C', -0.04, 30);
			}).toThrow('Interest rate must be non-negative');
		});

		it('should throw error for zero duration', () => {
			expect(() => {
				calculateMortgageWithEnergyLabel(50000, 300000, 'C', 0.04, 0);
			}).toThrow('Duration must be positive');
		});

		it('should use home value as appraised value when not provided', () => {
			const result = calculateMortgageWithEnergyLabel(50000, 300000, 'C', 0.04, 30);
			expect(result.appraisedValue).toBe(300000);
		});
	});
});
