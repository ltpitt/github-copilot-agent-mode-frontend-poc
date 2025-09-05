/**
 * Energy labels for property efficiency ratings (A-G)
 */
export type EnergyLabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/**
 * Result of mortgage calculation with energy label considerations
 */
export interface MortgageCalculationResult {
	homeValue: number;
	baseCapacity: number;
	energyLabelAdjustment: number;
	revisedCapacity: number;
	appraisedValue: number;
	finalLoanAmount: number;
	outOfPocket: number;
	monthlyPayment: number;
	energyLabel: EnergyLabel;
}

/**
 * Calculates monthly mortgage payments using the annuity formula.
 * Formula: M = P * (r(1+r)^n) / ((1+r)^n - 1)
 *
 * @param principal - The loan amount (P)
 * @param annualInterestRate - The annual interest rate as a decimal (e.g., 0.05 for 5%)
 * @param numberOfPayments - The total number of monthly payments (n)
 * @returns The monthly payment amount (M)
 */
export function calculateMonthlyPayment(
	principal: number,
	annualInterestRate: number,
	numberOfPayments: number
): number {
	// Validate input parameters
	if (principal < 0) {
		throw new Error('Principal must be non-negative');
	}
	if (annualInterestRate < 0) {
		throw new Error('Interest rate must be non-negative');
	}
	if (numberOfPayments <= 0) {
		throw new Error('Number of payments must be positive');
	}

	// Handle edge case: 0% interest rate
	if (annualInterestRate === 0) {
		return principal / numberOfPayments;
	}

	// Convert annual interest rate to monthly interest rate
	const monthlyInterestRate = annualInterestRate / 12;

	// Apply the annuity formula: M = P * (r(1+r)^n) / ((1+r)^n - 1)
	const onePlusR = 1 + monthlyInterestRate;
	const onePlusRToN = Math.pow(onePlusR, numberOfPayments);

	const numerator = principal * monthlyInterestRate * onePlusRToN;
	const denominator = onePlusRToN - 1;

	return numerator / denominator;
}

/**
 * Calculates energy label adjustment based on 2025 Dutch regulations
 * @param energyLabel - The energy label of the property
 * @param income - Annual income to determine reduction thresholds
 * @returns Adjustment amount (positive for bonus, negative for reduction)
 */
export function calculateEnergyLabelAdjustment(energyLabel: EnergyLabel, income: number): number {
	switch (energyLabel) {
		case 'A':
		case 'B':
			// Energy-efficient homes get additional borrowing capacity
			return 10000;
		
		case 'C':
		case 'D':
			// No adjustment for average efficiency (base case)
			return 0;
		
		case 'E':
		case 'F':
		case 'G':
			// Reduction based on income level
			if (income >= 40000 && income <= 50000) {
				return -5500;
			} else if (income > 50000) {
				// Scale reduction up to €30,000 for high incomes
				const scalingFactor = Math.min((income - 50000) / 100000, 1); // Cap at €150k income
				return -5500 - (24500 * scalingFactor); // Range from -5500 to -30000
			}
			return -5500; // Minimum reduction for lower incomes
		
		default:
			return 0;
	}
}

/**
 * Calculates maximum mortgage amount considering energy label and Dutch 2025 regulations
 * @param income - Annual gross income
 * @param homeValue - Value of the home being purchased
 * @param energyLabel - Energy efficiency label of the property
 * @param annualInterestRate - Annual interest rate as decimal
 * @param durationYears - Loan duration in years
 * @param appraisedValue - Optional appraised value (defaults to homeValue)
 * @returns Complete mortgage calculation result
 */
export function calculateMortgageWithEnergyLabel(
	income: number,
	homeValue: number,
	energyLabel: EnergyLabel,
	annualInterestRate: number,
	durationYears: number,
	appraisedValue?: number
): MortgageCalculationResult {
	// Validate inputs
	if (income <= 0) throw new Error('Income must be positive');
	if (homeValue <= 0) throw new Error('Home value must be positive');
	if (annualInterestRate < 0) throw new Error('Interest rate must be non-negative');
	if (durationYears <= 0) throw new Error('Duration must be positive');

	// Use homeValue as appraisedValue if not provided
	const finalAppraisedValue = appraisedValue ?? homeValue;

	// Calculate base borrowing capacity (4.5x annual income)
	const baseCapacity = income * 4.5;

	// Calculate energy label adjustment
	const energyLabelAdjustment = calculateEnergyLabelAdjustment(energyLabel, income);

	// Calculate revised capacity
	const revisedCapacity = baseCapacity + energyLabelAdjustment;

	// Final loan amount cannot exceed appraised value
	const finalLoanAmount = Math.min(revisedCapacity, finalAppraisedValue);

	// Calculate out-of-pocket amount
	const outOfPocket = homeValue - finalLoanAmount;

	// Calculate monthly payment
	const numberOfPayments = durationYears * 12;
	const monthlyPayment = calculateMonthlyPayment(finalLoanAmount, annualInterestRate, numberOfPayments);

	return {
		homeValue,
		baseCapacity,
		energyLabelAdjustment,
		revisedCapacity,
		appraisedValue: finalAppraisedValue,
		finalLoanAmount,
		outOfPocket: Math.max(0, outOfPocket), // Ensure non-negative
		monthlyPayment,
		energyLabel
	};
}
