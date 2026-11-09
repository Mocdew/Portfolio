<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { caseStudyHref, projects } from '$lib/data/projects';
	import { education, experience, site } from '$lib/data/site';

	const selected = [
		{
			slug: 'can-i-borrow',
			label: 'Credit risk',
			body: 'Built a loan default risk engine that calibrates risk estimates, explains individual predictions and records how each model version was trained. Both models reached about 0.76 ROC-AUC on 51,070 held-out loans.'
		},
		{
			slug: 'credipulse',
			label: 'Credit scorecards',
			body: 'Built a scorecard whose point contributions explain each decision. Set cutoffs by expected loss for each loan-size band and benchmarked the scorecard against a LightGBM challenger.'
		},
		{
			slug: 'dsn-hackathon',
			label: 'Forecasting',
			body: 'Placed 27th in the DSN Bootcamp qualification hackathon. Error analysis led to a store-ratio model that beat three tuned boosting models in repeated cross-validation.'
		},
		{
			slug: 'brent-volatility',
			label: 'Financial time series',
			body: 'Forecast Brent crude volatility from 39 years of price data. Gradient boosting on lagged features reached 4.6% MAPE versus 60% for the GARCH baseline on the same horizon.'
		}
	].map((entry) => ({ ...entry, project: projects.find((p) => p.slug === entry.slug)! }));

	const skillGroups = [
		{
			label: 'Modeling',
			items: ['Tabular ML', 'Credit scorecards', 'Survival analysis', 'Time series']
		},
		{
			label: 'Evaluation',
			items: ['Calibration', 'Cost-based thresholds', 'SHAP', 'Walk-forward validation']
		},
		{
			label: 'Engineering',
			items: ['Python', 'SQL', 'REST APIs', 'Model versioning', 'Testing and CI']
		}
	];
	const toolGroups = [
		{
			label: 'ML and data',
			items: ['scikit-learn', 'LightGBM', 'PyTorch', 'SciPy', 'statsmodels', 'pandas']
		},
		{ label: 'Delivery', items: ['Flask', 'FastAPI', 'React', 'pytest', 'GitHub Actions'] }
	];
</script>

<Seo
	title="CV"
	description="Experience, technical skills, education and selected machine learning projects by {site.name}."
/>

<div class="cv-page">
	<nav aria-label="CV" class="cv-masthead">
		<a href="/" class="cv-back"><span aria-hidden="true">←</span> Portfolio</a>
		<div class="cv-actions">
			<ThemeToggle />
			{#if site.resume}
				<a href={site.resume} download class="cv-download"
					>Download PDF <Icon name="arrow-down" size={15} /></a
				>
			{/if}
		</div>
	</nav>

	<div class="cv-grid">
		<header class="cv-identity cv-pad">
			<div class="cv-mark" aria-hidden="true">
				<span class="cv-mark-command">&gt;_</span>
				<span class="cv-mark-initials">OE</span>
				<span class="cv-mark-caption">ML / NG</span>
			</div>
			<p class="cv-kicker">Curriculum vitae</p>
			<h1>{site.name}</h1>
			<p class="cv-role">{site.role}</p>
			<p class="cv-intro">{site.focus} · {site.location}</p>
			<a href="/#projects" class="cv-link"
				>Portfolio and case studies <span aria-hidden="true">↗</span></a
			>
		</header>

		<div class="cv-body">
			<section class="cv-pad cv-section" aria-labelledby="cv-summary">
				<h2 id="cv-summary">Summary</h2>
				<p>
					I build machine learning systems for credit risk, payment recovery and forecasting. I
					focus on calibrated predictions and the decisions that follow them, from the cost of
					missing a default to when it makes sense to retry a payment.
				</p>
				<p>
					At Notzero Technologies, I built Recoup, a failed-payment recovery system with an operator
					console and a rollout gate. My independent work includes loan scoring APIs, versioned
					model cards, and forecasting experiments that compare new models against established
					baselines.
				</p>
			</section>

			<section class="cv-pad cv-section" aria-labelledby="cv-experience">
				<h2 id="cv-experience">Experience</h2>
				{#each experience as job (job.org)}
					<article class="cv-entry">
						<div class="cv-entry-head">
							<h3>{job.role} <span>· {job.org}</span></h3>
							<p class="cv-entry-meta">{job.dates}</p>
						</div>
						<p class="cv-entry-meta">{job.where}</p>
						<ul class="cv-bullets">
							{#each job.highlights as highlight (highlight)}
								<li>{highlight}</li>
							{/each}
						</ul>
						{#if job.project}
							{@const project = projects.find((p) => p.slug === job.project)}
							{#if project?.caseStudy}
								<a href={caseStudyHref(project)} class="cv-link"
									>{project.title} case study <span aria-hidden="true">↗</span></a
								>
							{/if}
						{/if}
					</article>
				{/each}
			</section>

			<section class="cv-pad cv-section" aria-labelledby="cv-projects">
				<h2 id="cv-projects">Selected projects</h2>
				{#each selected as { project, label, body } (project.slug)}
					<article class="cv-entry">
						<p class="cv-kicker">{label}</p>
						<h3>{project.title}</h3>
						<p>{body}</p>
						{#if project.caseStudy}
							<a href={caseStudyHref(project)} class="cv-link"
								>{project.title} case study <span aria-hidden="true">↗</span></a
							>
						{:else if project.links.github}
							<a href={project.links.github} class="cv-link"
								>{project.title} on GitHub <span aria-hidden="true">↗</span></a
							>
						{/if}
					</article>
				{/each}
			</section>
		</div>

		<aside class="cv-details" aria-label="Contact, skills and education">
			<section class="cv-pad cv-section" aria-labelledby="cv-contact">
				<h2 id="cv-contact">Contact</h2>
				<ul class="cv-contact">
					<li><a href="mailto:{site.email}"><Icon name="mail" size={15} /> {site.email}</a></li>
					<li><a href={site.socials.linkedin}><Icon name="linkedin" size={15} /> LinkedIn</a></li>
					<li>
						<a href={site.socials.github}><Icon name="github" size={15} /> GitHub / Mocdew</a>
					</li>
				</ul>
			</section>
			{#each [{ id: 'cv-skills', title: 'Skills', groups: skillGroups }, { id: 'cv-tools', title: 'Tools', groups: toolGroups }] as { id, title, groups } (id)}
				<section class="cv-pad cv-section" aria-labelledby={id}>
					<h2 {id}>{title}</h2>
					<dl class="cv-groups">
						{#each groups as { label, items } (label)}
							<div>
								<dt class="cv-kicker">{label}</dt>
								<dd>{items.join(' · ')}</dd>
							</div>
						{/each}
					</dl>
				</section>
			{/each}
			<section class="cv-pad cv-section" aria-labelledby="cv-education">
				<h2 id="cv-education">Education</h2>
				<h3>{education.school}</h3>
				<p>{education.degree}</p>
				<p class="cv-entry-meta">{education.dates}</p>
			</section>
		</aside>
	</div>
</div>

<style>
	.cv-page {
		--cv-rule: color-mix(in srgb, var(--color-fg) 17%, var(--color-panel));
		--cv-rail: color-mix(in srgb, var(--color-bg) 95%, var(--color-fg));
		background: var(--color-bg);
		font-family: var(--font-sans);
	}

	.cv-masthead,
	.cv-actions,
	.cv-download,
	.cv-contact a {
		display: flex;
		align-items: center;
	}

	.cv-masthead {
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.85rem clamp(1rem, 3vw, 2.25rem);
		border-bottom: 1px solid var(--cv-rule);
		background: var(--color-panel);
	}

	.cv-actions {
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.65rem;
	}
	.cv-back,
	.cv-download,
	.cv-kicker,
	.cv-entry-meta {
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	.cv-back,
	.cv-download,
	.cv-kicker {
		font-weight: 600;
		letter-spacing: 0.075em;
		text-transform: uppercase;
	}
	.cv-back {
		white-space: nowrap;
	}
	.cv-back:hover {
		text-decoration: underline;
	}
	.cv-download {
		gap: 0.4rem;
		min-height: 2.25rem;
		padding: 0.35rem 0.7rem;
		border: 1px solid var(--color-fg);
		background: var(--color-fg);
		color: var(--color-bg);
		box-shadow: 2px 2px 0 var(--color-accent);
	}

	.cv-download:hover {
		box-shadow: 3px 3px 0 var(--color-accent);
	}
	.cv-grid {
		display: grid;
		grid-template-areas: 'identity' 'body' 'details';
	}
	.cv-identity {
		grid-area: identity;
	}
	.cv-body {
		grid-area: body;
		min-width: 0;
	}
	.cv-details {
		grid-area: details;
		min-width: 0;
	}
	.cv-identity,
	.cv-details {
		background: var(--cv-rail);
	}
	.cv-pad {
		padding: clamp(1.45rem, 4vw, 3rem);
	}
	.cv-section {
		border-top: 1px solid var(--cv-rule);
	}
	.cv-mark {
		display: grid;
		align-content: space-between;
		width: 6.25rem;
		aspect-ratio: 1;
		margin-bottom: 1.45rem;
		padding: 0.6rem;
		border: 1px solid var(--color-fg);
		background: var(--color-fg);
		color: var(--color-bg);
		box-shadow: 3px 3px 0 var(--color-accent);
		font-family: var(--font-mono);
		line-height: 1;
	}

	.cv-mark-command,
	.cv-mark-caption {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
	}
	.cv-mark-initials {
		font-size: 2.3rem;
		font-weight: 650;
		letter-spacing: -0.1em;
	}
	.cv-kicker,
	.cv-entry-meta {
		color: var(--color-muted);
	}
	.cv-role {
		margin-top: 0.4rem;
		font-size: 1.04rem;
		font-weight: 550;
	}
	.cv-intro {
		margin-top: 0.45rem;
		color: var(--color-muted);
	}
	h1,
	h2,
	h3 {
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.18;
	}
	h1 {
		margin-top: 0.4rem;
		font-size: clamp(1.9rem, 3.4vw, 3.1rem);
	}
	h2 {
		margin-bottom: 0.95rem;
		font-size: clamp(1.35rem, 2.5vw, 1.75rem);
	}
	h3 {
		font-size: 1.05rem;
	}
	.cv-body p:not(.cv-kicker, .cv-entry-meta),
	.cv-bullets,
	.cv-details dd,
	.cv-details section > p {
		color: var(--color-muted);
		line-height: 1.65;
	}

	.cv-body p + p:not(.cv-entry-meta) {
		margin-top: 0.85rem;
	}
	.cv-entry + .cv-entry {
		border-top: 1px solid var(--cv-rule);
		margin-top: 1.25rem;
		padding-top: 1.25rem;
	}
	.cv-entry h3 + p:not(.cv-entry-meta),
	.cv-entry .cv-kicker + h3 {
		margin-top: 0.35rem;
	}
	.cv-entry-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.25rem 0.8rem;
	}
	.cv-entry-head h3 span {
		font-weight: 500;
	}
	.cv-entry-head + .cv-entry-meta {
		margin-top: 0.35rem;
	}
	.cv-bullets {
		margin: 0.75rem 0 0;
		padding-left: 1.2rem;
		list-style: disc;
	}
	.cv-bullets li + li {
		margin-top: 0.3rem;
	}
	.cv-link {
		display: inline-block;
		margin-top: 0.75rem;
		color: var(--color-accent);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.cv-link:hover {
		text-decoration-thickness: 2px;
	}
	.cv-contact,
	.cv-groups {
		display: grid;
		gap: 0.65rem;
		font-size: 0.9rem;
	}
	.cv-contact a {
		width: fit-content;
		gap: 0.55rem;
		overflow-wrap: anywhere;
	}
	.cv-contact a:hover {
		text-decoration: underline;
	}
	.cv-groups dt {
		margin-bottom: 0.15rem;
	}

	@media (min-width: 54rem) {
		.cv-grid {
			grid-template-columns: minmax(17rem, 30%) minmax(0, 1fr);
			grid-template-rows: auto 1fr;
			grid-template-areas: 'identity body' 'details body';
		}
		.cv-identity,
		.cv-details {
			border-right: 1px solid var(--cv-rule);
		}
		.cv-body > .cv-section:first-child {
			border-top: 0;
		}
		.cv-body > .cv-pad {
			padding-inline: clamp(2rem, 5vw, 4rem);
		}
	}
</style>
