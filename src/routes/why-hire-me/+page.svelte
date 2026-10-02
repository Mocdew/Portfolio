<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { education, experience, site } from '$lib/data/site';

	const reasons = [
		{
			title: 'I ship models, not notebooks.',
			body: 'Can I borrow.ai trains, calibrates and versions its models, writes its own model card, and serves predictions through a Flask API backed by 93 tests. CrediPulse and Deal Desk ship the same way: code someone else can run, check and maintain.',
			proof: '#can-i-borrow'
		},
		{
			title: 'I measure what the business actually pays for.',
			body: 'Decision thresholds are tuned to the cost of a missed default, not to accuracy. CrediPulse sets its cutoffs in money, per loan size. Recoup, built during my internship at Notzero, is judged by dollars recovered per failed invoice — 31% more than the standard retry schedule in simulation.',
			proof: '#recoup'
		},
		{
			title: 'I report results honestly.',
			body: 'Confidence intervals, paired significance tests, walk-forward validation. In the DSN hackathon, error analysis showed a simple store-ratio model beat tuned LightGBM, XGBoost and CatBoost — so that is the model I shipped.',
			proof: '#dsn-hackathon'
		},
		{
			title: 'I take fairness and regulation seriously.',
			body: 'In both credit projects, attributes that are prohibited bases under ECOA / Regulation B are kept out of the model — and in Can I borrow.ai a unit test enforces it, and every training run screens for disparate impact and records the result in the model card.',
			proof: '#credipulse'
		}
	];
</script>

<Seo
	title="Why hire me"
	description="What {site.name} brings to a machine learning team: shipped models, business-focused metrics, honest evaluation and fair-lending awareness."
/>

<article class="py-16 sm:py-24">
	<a href="/" class="text-sm text-muted hover:text-fg">← back</a>

	<h1 class="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">Why hire me</h1>
	<p class="mt-4 max-w-prose font-sans leading-relaxed text-muted">
		Computer Science graduate and former ML intern at Notzero Technologies, building machine
		learning for fintech. Strongest in tabular ML, forecasting and explainability; growing in deep
		learning, NLP and LLM integrations. Four things you can expect from me:
	</p>

	<ol class="mt-10 space-y-8">
		{#each reasons as reason, i (reason.title)}
			<li class="grid gap-2 sm:grid-cols-[3rem_1fr]">
				<span class="text-sm text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</span>
				<div>
					<h2 class="font-semibold text-fg">{reason.title}</h2>
					<p class="mt-2 max-w-prose font-sans leading-relaxed text-muted">{reason.body}</p>
					<a href="/{reason.proof}" class="mt-2 inline-block text-sm text-accent hover:underline">
						See the project →
					</a>
				</div>
			</li>
		{/each}
	</ol>

	<div class="mt-14 border-t border-hairline pt-8">
		<h2 class="text-sm tracking-[0.2em] text-dim uppercase">Background</h2>
		<ul class="mt-3 space-y-2 font-sans">
			{#each experience as job (job.org)}
				<li class="flex flex-wrap justify-between gap-x-4">
					<span class="text-fg">{job.role} — {job.org}, {job.where}</span>
					<span class="text-sm text-muted">{job.dates}</span>
				</li>
			{/each}
			<li class="flex flex-wrap justify-between gap-x-4">
				<span class="text-fg">{education.degree} — {education.school}</span>
				<span class="text-sm text-muted">{education.dates}</span>
			</li>
		</ul>
	</div>

	<div class="mt-10 flex flex-wrap gap-3 text-sm">
		<a
			href="mailto:{site.email}"
			class="inline-flex items-center gap-2 rounded border border-fg px-4 py-2 font-semibold transition-colors hover:bg-fg hover:text-bg"
		>
			<Icon name="mail" size={15} /> Get in touch
		</a>
		{#if site.resume}
			<a
				href={site.resume}
				class="inline-flex items-center gap-2 rounded border border-hairline px-4 py-2 text-muted hover:text-fg"
			>
				<Icon name="file" size={15} /> Résumé (PDF)
			</a>
		{/if}
	</div>
</article>
