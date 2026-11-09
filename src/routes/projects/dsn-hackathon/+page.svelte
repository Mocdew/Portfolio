<script lang="ts">
	import BarChart from '$lib/components/case-study/BarChart.svelte';
	import CaseStudy from '$lib/components/case-study/CaseStudy.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import { projects } from '$lib/data/projects';

	const storeChart = projects.find((project) => project.slug === 'dsn-hackathon')?.image;
	const rmse = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 });
</script>

<CaseStudy
	slug="dsn-hackathon"
	summary="For the DSN AI Bootcamp qualification hackathon, I built a retail sales model that uses a product’s price and the store’s sales history. It placed 27th on Kaggle and beat three tuned boosting models in repeated cross-validation."
>
	<section id="problem" aria-labelledby="problem-heading">
		<SectionHeading id="problem" index={1} title="The problem" />
		<p>
			The competition asked for a prediction of total sales for each product at a store. A product
			can have the same shelf price in a corner shop and a supermarket, but those stores sell very
			different volumes. I wanted to see how much of the forecasting problem that difference could
			explain.
		</p>
	</section>

	<section id="approach" aria-labelledby="approach-heading">
		<SectionHeading id="approach" index={2} title="What the errors revealed" />
		<p>
			I divided observed sales by product price to compare turnover across stores. The two corner
			shops recorded sales around 2.4 to 2.5 times the product price. The eight larger stores ranged
			from about 14 to 26 times. That suggested a simple forecast:
			<strong>product price × estimated store rate.</strong>
		</p>
		{#if storeChart}
			<figure class="my-8 overflow-hidden rounded-md border border-hairline bg-panel">
				{#each storeChart.srcLight ? [[storeChart.src, 'dark-only'], [storeChart.srcLight, 'light-only']] : [[storeChart.src, '']] as [src, theme] (src)}
					<img
						{src}
						alt={storeChart.alt}
						width={storeChart.width}
						height={storeChart.height}
						loading="lazy"
						decoding="async"
						class="h-auto w-full {theme}"
					/>
				{/each}
				<figcaption class="px-4 py-3 font-sans text-sm text-muted">
					Sales per unit of product price varied far more between store formats than a single
					retail-wide rate could capture.
				</figcaption>
			</figure>
		{/if}
		<p>
			For a store missing from the training data, there is no store rate to look up. I used a rate
			estimated from its store format as a starting point. A new corner shop could then borrow
			information from stores of the same type.
		</p>
	</section>

	<section id="results" aria-labelledby="results-heading">
		<SectionHeading id="results" index={3} title="How I checked it" />
		<p>
			I compared the store-ratio model with tuned LightGBM, XGBoost and CatBoost on the same
			validation folds, repeating the five-fold split. The store-ratio model reached
			<strong>1,070.8 RMSE</strong> (root mean squared error), compared with
			<strong>1,097–1,101</strong> for the tuned models. Lower is better.
		</p>
		<BarChart
			caption="Error on unseen stores (RMSE, lower is better)"
			format={(value) => rmse.format(value)}
			rows={[
				{ label: 'Before store-format priors', value: 1436.6 },
				{ label: 'With store-format priors', value: 1171.5, highlight: true }
			]}
		/>
		<p>
			The model also produced a range around each forecast. The <strong
				>80% prediction intervals</strong
			>
			contained <strong>79.7%</strong> of observed sales in the evaluation. I packaged the solution with
			automated tests and GitHub Actions.
		</p>
	</section>

	<section id="limits" aria-labelledby="limits-heading">
		<SectionHeading id="limits" index={4} title="What I’d test next" />
		<p>
			The store chart covers ten locations, including only two corner shops. The format rate is a
			starting estimate for a new store. With more stores and dated observations, I’d check error
			and interval coverage by format and on a later period, where a change in demand could expose
			weaknesses in the rates.
		</p>
	</section>
</CaseStudy>
