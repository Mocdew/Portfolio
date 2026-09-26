export const site = {
	name: 'Olumide Erinfolami',
	// Shown in the big block-letter hero. Keep it short: every letter adds ~9 columns.
	asciiName: 'OLUMIDE',
	role: 'Machine Learning Engineer',
	focus: 'Applied ML for fintech',
	location: 'Lagos, Nigeria',
	// TODO: replace with the real address once the site is deployed.
	url: 'https://olumide-erinfolami.vercel.app',
	description:
		'Machine learning engineer building credit-risk, forecasting and payments models for fintech — shipped as APIs with tests, model cards and honest limitations.',
	email: 'anthonyerinfolami@gmail.com',
	socials: {
		github: 'https://github.com/Mocdew',
		linkedin: 'https://www.linkedin.com/in/olumide-erinfolami-532b32276/'
	},
	// Public copy with the phone number removed. Keep this file in /static in sync with the
	// master résumé, and re-check it for private details before replacing it.
	resume: '/Olumide_Erinfolami_Resume.pdf' as string | null
};

export const experience = [
	{
		role: 'Machine Learning Intern',
		org: 'Notzero Technologies',
		where: 'Nigeria (hybrid)',
		dates: 'Mar 2026 – Sep 2026'
	}
];

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
