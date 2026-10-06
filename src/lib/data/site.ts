export const site = {
	name: 'Olumide Erinfolami',
	// Shown in the big block-letter hero. Keep it short: every letter adds ~9 columns.
	asciiName: 'OLUMIDE',
	role: 'Machine Learning Engineer',
	focus: 'Applied ML for fintech',
	location: 'Lagos, Nigeria',
	// Production address; used for canonical and social-preview URLs. Update if a custom domain is added.
	url: 'https://olumide-erinfolami.vercel.app',
	description:
		'Machine learning engineer building credit-risk, forecasting and payments models for fintech, shipped as APIs with tests, model cards and honest limitations.',
	email: 'anthonyerinfolami@gmail.com',
	socials: {
		github: 'https://github.com/Mocdew',
		linkedin: 'https://www.linkedin.com/in/olumide-erinfolami-532b32276/'
	},
	// Public copy with the phone number removed. Keep this file in /static in sync with the
	// master résumé, and re-check it for private details before replacing it.
	resume: '/Olumide_Erinfolami_Resume.pdf' as string | null
};

export type Job = {
	role: string;
	org: string;
	where: string;
	dates: string;
	/** Bullet points shown on the home page timeline. Keep in step with the résumé. */
	highlights: string[];
	/** Anchor of the project card this role produced, if any. */
	project?: string;
};

export const experience: Job[] = [
	{
		role: 'Machine Learning Intern',
		org: 'Notzero Technologies',
		where: 'Nigeria (hybrid)',
		dates: 'Mar 2026 – Sep 2026',
		highlights: [
			'Built Recoup, which decides when to retry a failed subscription payment, how many times, and when to ask for a new card, replacing the fixed 1/3/7-day retry rule.',
			'Modelled the chance each customer can pay at each retry time with probabilistic models in Python and SciPy, shared across merchants so small businesses with little history still benefit.',
			'Recovered 31% more revenue per failed payment than the fixed rule in simulation ($15.93 vs $12.12), and 20–35% more across six stress-test scenarios.',
			'Added a safety gate that blocks rollout until real-world evidence confirms the gain.'
		],
		project: 'recoup'
	}
];

export const education = {
	degree: 'B.Sc. Computer Science',
	school: 'Covenant University',
	dates: '2021 – 2025'
};

export type Skill = { group: string; items: string[] };

export const skills: Skill[] = [
	{ group: 'Languages & tools', items: ['Python', 'SQL', 'Git', 'GitHub Actions', 'Jupyter'] },
	{
		group: 'Machine learning',
		items: [
			'scikit-learn',
			'LightGBM',
			'XGBoost',
			'CatBoost',
			'Optuna',
			'Calibration',
			'Cost-sensitive thresholds',
			'SHAP'
		]
	},
	{
		group: 'Deep learning & NLP',
		items: ['PyTorch', 'GRU / LSTM', 'TF-IDF', 'Embeddings', 'Text classification']
	},
	{
		group: 'Time series & statistics',
		items: [
			'ARIMA / SARIMA',
			'GARCH',
			'HAR-RV',
			'SciPy',
			'Hierarchical models',
			'Thompson sampling'
		]
	},
	{
		group: 'Deployment & data',
		items: [
			'Flask REST APIs',
			'pytest',
			'Model versioning',
			'Streamlit',
			'Gradio',
			'pandas',
			'NumPy',
			'Plotly'
		]
	}
];
