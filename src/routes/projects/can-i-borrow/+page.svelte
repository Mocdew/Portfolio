<script lang="ts">
	import BarChart from '$lib/components/case-study/BarChart.svelte';
	import CaseStudy from '$lib/components/case-study/CaseStudy.svelte';
	import Flow from '$lib/components/case-study/Flow.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	// Every number on this page comes from the Can-I-Borrow README (held-out test cohort of
	// 51,070 loans; 163,421 fit / 40,856 calibration / 51,070 test, stratified, seed 42).
	const metrics = [
		{
			model: 'Logistic regression',
			ap: '0.332',
			auc: '0.759',
			ks: '0.386',
			ece: '0.0049',
			recall: '80.8%',
			precision: '19.0%'
		},
		{
			model: 'LightGBM',
			ap: '0.329',
			auc: '0.757',
			ks: '0.382',
			ece: '0.0043',
			recall: '80.0%',
			precision: '19.2%'
		}
	];
</script>

<CaseStudy
	slug="can-i-borrow"
	summary="A loan default risk engine trained on 255,000 consumer loans. It gives an underwriter an honest probability that a borrower will default, a recommendation priced in money, and the top reasons behind every decision, with the attributes the law forbids kept out of the model."
>
	<section id="problem" aria-labelledby="problem-heading">
		<SectionHeading id="problem" index={1} title="The problem" />
		<p>
			A lender has to decide, applicant by applicant, whether to lend. A model that helps with that
			has to do more than score well on a test set:
		</p>
		<ul>
			<li>
				<strong>Its percentages must be true.</strong> "12% risk" should mean 12 in 100 such borrowers
				default, because the number gets shown to people and used for pricing.
			</li>
			<li>
				<strong>Its decisions must follow the cost of mistakes.</strong> Lending to someone who defaults
				costs far more than turning away someone who would have paid.
			</li>
			<li>
				<strong>It must explain itself.</strong> A declined applicant is entitled to the main reasons.
			</li>
			<li>
				<strong>It must not discriminate.</strong> Some attributes cannot legally be used to decide credit.
			</li>
		</ul>
	</section>

	<section id="approach" aria-labelledby="approach-heading">
		<SectionHeading id="approach" index={2} title="The approach" />
		<Flow
			caption="How one application is scored. The serving code loads a single versioned bundle, so training and scoring cannot disagree."
			steps={[
				{ title: 'Check', body: 'Validate every field. Nothing is filled in with a default.' },
				{
					title: 'Score',
					body: 'Logistic regression or LightGBM on engineered affordability features.'
				},
				{ title: 'Calibrate', body: 'Turn the score into a probability that can be trusted.' },
				{ title: 'Decide', body: 'Apply a threshold chosen by the cost of each kind of mistake.' },
				{ title: 'Explain', body: 'Turn exact attributions into adverse-action reason codes.' }
			]}
		/>
		<h3>Honest probabilities</h3>
		<p>
			A common trick for rare events is to re-weight the training data. It catches more defaults but
			quietly breaks the probabilities, so every percentage downstream becomes wrong. I trained at
			the natural default rate and handled the imbalance at the decision threshold instead, then
			calibrated each model on data it had never seen (isotonic or Platt, whichever had the lower
			Brier score).
		</p>
		<h3>A threshold priced in money</h3>
		<p>
			The decision threshold is chosen by minimum expected cost, with a missed default treated as 10
			times worse than a false alarm. The threshold is stored and versioned with the model, and risk
			tiers are set as multiples of the base rate (0.5×, 1×, 2×) so they stay meaningful if the
			portfolio changes.
		</p>
		<h3>Rules an underwriter would expect</h3>
		<p>
			The boosted model is constrained so risk can only fall as credit score, income or time in
			employment rise, and only rise with interest rate, loan size or debt-to-income. Tests verify
			it, and it is what makes the "what if" view in the web app defensible.
		</p>
		<h3>Fair lending built in</h3>
		<p>
			Marital status and dependants are prohibited bases for credit decisions under ECOA and
			Regulation B. They are kept out of the model, enforced at three points in the pipeline and by
			a unit test, but retained separately, because measuring unfair outcomes needs them. Every
			training run screens approval rates across groups with the four-fifths rule and records any
			flags in the model card.
		</p>
	</section>

	<section id="results" aria-labelledby="results-heading">
		<SectionHeading id="results" index={3} title="Results" />
		<p>
			Measured on <strong>51,070 loans the models never saw</strong>. About 11.6% of borrowers in
			this data default, so a model that simply says "nobody defaults" is 88.4% accurate and
			useless. That is why accuracy is not reported.
		</p>
		<BarChart
			caption="Is the predicted default rate honest?"
			format={(v) => `${v.toFixed(2)}%`}
			max={14}
			rows={[
				{ label: 'Predicted by the model', value: 11.7, highlight: true },
				{ label: 'Actually defaulted', value: 11.61 }
			]}
		/>
		<p>
			At the cost-tuned threshold the model <strong>catches about 80% of defaults</strong>. Around 1
			in 5 of the applicants it flags would actually default, a deliberate trade, because missing a
			default costs ten times more than a second look at a good applicant.
		</p>
		<div class="my-6 overflow-x-auto rounded-md border border-hairline">
			<table class="w-full text-left text-sm tabular-nums">
				<caption class="bg-panel px-4 py-2 text-left font-sans text-sm text-fg">
					Held-out test results for both models
				</caption>
				<thead class="bg-panel text-[11px] tracking-wider text-dim uppercase">
					<tr>
						<th scope="col" class="px-4 py-2 font-normal">Model</th>
						<th scope="col" class="px-4 py-2 font-normal">ROC-AUC</th>
						<th scope="col" class="px-4 py-2 font-normal">Avg. precision</th>
						<th scope="col" class="px-4 py-2 font-normal">KS</th>
						<th scope="col" class="px-4 py-2 font-normal">Calib. error</th>
						<th scope="col" class="px-4 py-2 font-normal">Defaults caught</th>
						<th scope="col" class="px-4 py-2 font-normal">Precision</th>
					</tr>
				</thead>
				<tbody>
					{#each metrics as m (m.model)}
						<tr class="border-t border-hairline text-muted">
							<th scope="row" class="px-4 py-3 text-left font-normal whitespace-nowrap text-fg"
								>{m.model}</th
							>
							<td class="px-4 py-3">{m.auc}</td>
							<td class="px-4 py-3">{m.ap}</td>
							<td class="px-4 py-3">{m.ks}</td>
							<td class="px-4 py-3">{m.ece}</td>
							<td class="px-4 py-3">{m.recall}</td>
							<td class="px-4 py-3">{m.precision}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p>
			The simple logistic regression matched the gradient-boosted model on every measure, so both
			are served and an underwriter can compare them on the same applicant.
		</p>
	</section>

	<section id="engineering" aria-labelledby="engineering-heading">
		<SectionHeading id="engineering" index={4} title="Built as software" />
		<ul>
			<li>
				<strong>Versioned model bundles.</strong> Each training run writes one artifact holding the preprocessing,
				model, calibrator, threshold, test results and provenance, plus an auto-generated model card.
				Promotion to production is a separate, explicit step.
			</li>
			<li>
				<strong>A Flask API with a strict contract.</strong> Single and batch scoring, clear error codes
				(a batch that is too large is refused, never silently truncated), per-client rate limits and a
				health check that scores a canary.
			</li>
			<li>
				<strong>Drift monitoring.</strong> Scored requests are logged and compared with the training data
				using the Population Stability Index.
			</li>
			<li>
				<strong>93 tests</strong> that train a small model on synthetic data, so they check the pipeline
				rather than a frozen set of predictions.
			</li>
			<li>
				<strong>A web app for underwriters</strong> with single-applicant assessment, what-if sensitivity,
				portfolio scoring and the model card.
			</li>
		</ul>
	</section>

	<section id="limits" aria-labelledby="limits-heading">
		<SectionHeading id="limits" index={5} title="Limitations" />
		<ul>
			<li>
				<strong>No out-of-time test.</strong> The data has no dates, so performance on future loans is
				likely overstated by an amount the data cannot measure. The pipeline warns about this on every
				run.
			</li>
			<li>
				<strong>The 10:1 cost ratio is a placeholder.</strong> A real lender would replace it with measured
				losses and margins.
			</li>
			<li>
				<strong>Age is the strongest feature,</strong> and the fairness screen flags several age bands.
				That needs review before any real use.
			</li>
			<li>
				<strong>It supports an underwriter; it does not replace one.</strong> It must never be the only
				basis for declining someone.
			</li>
		</ul>
	</section>
</CaseStudy>
