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
