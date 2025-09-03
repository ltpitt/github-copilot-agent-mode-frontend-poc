import { describe, it, expect } from 'vitest';

// Example utility functions to test
function add(a: number, b: number): number {
	return a + b;
}

function multiply(a: number, b: number): number {
	return a * b;
}

function isEven(num: number): boolean {
	return num % 2 === 0;
}

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Unit tests for the utility functions
describe('Example Unit Tests', () => {
	describe('Math Operations', () => {
		it('should add two numbers correctly', () => {
			expect(add(2, 3)).toBe(5);
			expect(add(-1, 1)).toBe(0);
			expect(add(0, 0)).toBe(0);
		});

		it('should multiply two numbers correctly', () => {
			expect(multiply(3, 4)).toBe(12);
			expect(multiply(-2, 5)).toBe(-10);
			expect(multiply(0, 100)).toBe(0);
		});
	});

	describe('Number Utilities', () => {
		it('should correctly identify even numbers', () => {
			expect(isEven(2)).toBe(true);
			expect(isEven(3)).toBe(false);
			expect(isEven(0)).toBe(true);
			expect(isEven(-4)).toBe(true);
		});
	});

	describe('String Utilities', () => {
		it('should capitalize strings correctly', () => {
			expect(capitalize('hello')).toBe('Hello');
			expect(capitalize('WORLD')).toBe('World');
			expect(capitalize('tEST')).toBe('Test');
			expect(capitalize('')).toBe('');
		});
	});

	describe('Edge Cases', () => {
		it('should handle decimal numbers in addition', () => {
			expect(add(0.1, 0.2)).toBeCloseTo(0.3);
		});

		it('should handle single character strings', () => {
			expect(capitalize('a')).toBe('A');
			expect(capitalize('Z')).toBe('Z');
		});
	});
});
