export const loanAmounts = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000] as const;
type LoanAmount = (typeof loanAmounts)[number];

type Applicant = {
	id: string;
	label: string;
	income: number;
	creditScore: number;
	debtToIncome: number;
	originalAmount: LoanAmount;
	/** One illustrative percentage per loan amount, in the same order. */
	risk: readonly number[];
	factors: readonly [string, string];
};

// Fictional profiles and hand-authored outputs for a walkthrough of the scoring interface.
// Keep these separate from the case study's reported model results.
export const applicants = [
	{
		id: 'steady-income',
		label: 'Steady income',
		income: 92000,
		creditScore: 748,
		debtToIncome: 16,
		originalAmount: 20000,
		risk: [2.9, 3.2, 3.6, 4, 4.4, 4.9, 5.4, 6, 6.7],
		factors: [
			'A stronger credit score lowers risk.',
			'Existing debt takes up a smaller share of income.'
		]
	},
	{
		id: 'near-threshold',
		label: 'Near the threshold',
		income: 62000,
		creditScore: 677,
		debtToIncome: 29,
		originalAmount: 25000,
		risk: [5.9, 6.5, 7.3, 8.2, 9.4, 10.8, 12.4, 14.3, 16.4],
		factors: [
			'Existing debt already takes up 29% of income.',
			'A midrange credit score offers less offset.'
		]
	},
	{
		id: 'higher-debt',
		label: 'Higher debt burden',
		income: 54000,
		creditScore: 623,
		debtToIncome: 42,
		originalAmount: 35000,
		risk: [12.1, 13.5, 15.1, 16.9, 18.9, 21.1, 23.5, 26.1, 28.9],
		factors: ['Existing debt takes up 42% of income.', 'A lower credit score adds to the risk.']
	}
] as const satisfies readonly Applicant[];

/** LightGBM threshold reported in the project's held-out validation results. */
export const reviewThreshold = 8.5;
