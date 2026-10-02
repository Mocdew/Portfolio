export type Project = {
	slug: string;
	title: string;
	/** Primary language badge shown on the card. */
	language: string;
	/** One-line lead: the problem, in plain words. */
	hook: string;
	/** 2–4 sentences on what was built and how it was checked. */
	description: string;
	/** Headline numbers, rendered as highlighted chips. */
	metrics: string[];
	tags: string[];
	links: { github?: string; demo?: string; docs?: string };
	private?: boolean;
};

const gh = (repo: string) => `https://github.com/Mocdew/${repo}`;

export const projects: Project[] = [
	{
		slug: 'can-i-borrow',
		title: 'Can I borrow.ai',
		language: 'Python',
		hook: 'Loan decisions an underwriter can defend.',
		description:
			'End-to-end default-risk engine trained on 255K consumer loans. A training pipeline fits and calibrates logistic regression and LightGBM, then writes versioned, auditable model artifacts with auto-generated model cards. Served through a Flask API and web UI with TreeSHAP adverse-action reason codes, a disparate-impact screen on every training run, and protected attributes kept out of the model by a unit test.',
		metrics: ['ROC-AUC 0.76', 'ECE 0.004', 'catches 80% of defaults', '93 tests'],
		tags: ['LightGBM', 'scikit-learn', 'SHAP', 'Flask', 'pytest'],
		links: { github: gh('Can-I-Borrow') }
	},
	{
		slug: 'recoup',
		title: 'Recoup',
		language: 'Python',
		hook: 'Stop retrying failed payments on a fixed schedule.',
		description:
			'Built during my ML internship at Notzero Technologies. Decides when to retry a failed subscription payment, how many times, and when to ask for a new card — replacing the standard 1/3/7-day retry ladder. Combines a mixture-cure hazard model (separating "customer is gone" from "not funded yet"), shared across merchants so small businesses with little history still benefit, with an exact multi-step schedule planner, Thompson-sampling exploration and off-policy evaluation. A safety gate blocks rollout until real-world evidence confirms the gain. Measured in simulation against the fixed ladder.',
		metrics: [
			'+31% recovered per failed invoice',
			'$15.93 vs $12.12',
			'+20–35% across 6 stress scenarios',
			'+19% for small merchants'
		],
		tags: ['SciPy', 'Survival analysis', 'Contextual bandits', 'Simulation'],
		links: { github: gh('Recoup'), demo: 'https://recoup-zeta-ten.vercel.app/' }
	},
	{
		slug: 'credipulse',
		title: 'CrediPulse',
		language: 'Python',
		hook: 'A credit score that can explain every point.',
		description:
			'Auditable credit scorecard on the Statlog German Credit data. Sign-constrained WOE logistic regression makes per-feature points sum exactly to the score, so they double as adverse-action reason codes. Cutoffs are fitted in money (P(default) × EAD × LGD) per loan-size band, prohibited attributes are excluded, and metrics ship with bootstrap confidence intervals and a DeLong test against a LightGBM challenger. Flask dashboard with single and batch CSV scoring.',
		metrics: ['exact reason codes', 'money-based cutoffs', 'DeLong-tested challenger'],
		tags: ['Scorecard / WOE', 'LightGBM', 'SHAP', 'Flask', 'JavaScript'],
		links: { github: gh('CrediPulse-Explainable-Credit-Scoring-Platform') }
	},
	{
		slug: 'dsn-hackathon',
		title: 'DSN Hackathon 2026',
		language: 'Python',
		hook: 'The simple model won — and I can show why.',
		description:
			'Kaggle qualification hackathon for the DSN Bootcamp. Error analysis showed sales ≈ price × store turnover, so a store-ratio model beat tuned LightGBM, XGBoost and CatBoost under repeated, paired 5-fold cross-validation. Store-format priors cut error on unseen stores, and the 80% prediction intervals hit 79.7% actual coverage. Shipped as a tested package with GitHub Actions CI.',
		metrics: [
			'placed 40th',
			'CV RMSE 1,070.8 vs 1,097–1,101',
			'unseen stores 1,436.6 → 1,171.5',
			'79.7% interval coverage'
		],
		tags: ['Ridge', 'LightGBM', 'XGBoost', 'CatBoost', 'pytest', 'CI'],
		links: { github: gh('DSN') }
	},
	{
		slug: 'brent-volatility',
		title: 'Brent Crude Volatility',
		language: 'Python',
		hook: 'Four decades of oil prices, one surprising winner.',
		description:
			'Forecasts 39 years of Brent crude price volatility. Classical ARIMA and GARCH baselines against gradient boosting on lag features — the boosted model was far more accurate than GARCH(1,1) on the same horizon.',
		metrics: ['4.6% MAPE vs 60% for GARCH(1,1)'],
		tags: ['statsmodels', 'arch', 'LightGBM', 'Time series'],
		links: { github: gh('Brent-Crude-Oil-Price-Volatility-Forecasting') }
	},
	{
		slug: 'cpi-inflation',
		title: 'CPI Inflation Forecasting',
		language: 'Python',
		hook: 'Which model actually forecasts US inflation?',
		description:
			'Benchmarks ARIMA, SARIMA, LightGBM and LSTM on US CPI inflation using walk-forward validation, so every model is scored only on data it could not have seen.',
		metrics: ['walk-forward validation', '4 model families'],
		tags: ['statsmodels', 'LightGBM', 'PyTorch', 'Time series'],
		links: { github: gh('CPI-Inflation-Forecasting') }
	},
	{
		slug: 'eurusd-volatility',
		title: 'EUR/USD Volatility',
		language: 'Python',
		hook: 'Deep learning versus the econometrics baseline.',
		description:
			'GRU and LSTM models in PyTorch forecasting EUR/USD realised volatility, evaluated against the HAR-RV model — the standard econometric baseline a deep model has to beat to be worth its cost.',
		metrics: ['GRU & LSTM vs HAR-RV'],
		tags: ['PyTorch', 'GRU', 'LSTM', 'HAR-RV'],
		links: { github: gh('EUR-USD-Volatility-Forecasting-with-Deep-Learning') }
	},
	{
		slug: 'deal-desk',
		title: 'Deal Desk',
		language: 'Python',
		hook: 'Proof of what a sponsorship actually delivered.',
		description:
			'Flask SaaS MVP for creators. Google sign-in, YouTube API ingest, brand deals and deliverables, performance measured against the creator’s own baseline, and frozen shareable reports a brand can open without an account, with PDF export. OAuth tokens are encrypted at rest and never logged.',
		metrics: ['Google OAuth', 'encrypted tokens', 'pytest suite'],
		tags: ['Flask', 'OAuth 2.0', 'YouTube API', 'SQLAlchemy', 'pytest'],
		links: { github: gh('MVP') }
	},
	{
		slug: 'customer-segmentation',
		title: 'Customer Segmentation',
		language: 'Python',
		hook: 'Three methods, three answers, one justified pick.',
		description:
			'Segments ~9K credit card holders by spending and payment behaviour. Checks clustering tendency first (Hopkins statistic), reduces with PCA to 85% of variance, then compares K-Means and DBSCAN. The elbow, silhouette and Davies-Bouldin methods disagreed (k = 3, 2, 6), so the choice is argued from the evidence and the clusters are turned into customer personas.',
		metrics: ['9K cardholders', 'silhouette 0.28 at k = 2'],
		tags: ['scikit-learn', 'K-Means', 'DBSCAN', 'PCA'],
		links: { github: gh('Credit-Card-Customer-Segmentation---Cluster-Analysis') }
	}
];
