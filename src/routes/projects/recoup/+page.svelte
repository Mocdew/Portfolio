<script lang="ts">
	import BarChart from '$lib/components/case-study/BarChart.svelte';
	import CaseStudy from '$lib/components/case-study/CaseStudy.svelte';
	import Flow from '$lib/components/case-study/Flow.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	// Every number on this page comes from the Recoup README (python benchmark.py and the
	// reference run of recoup-ops demo). All of it is simulated.
	const usd = (v: number) => `$${v.toFixed(2)}`;
	const pct = (v: number) => `+${v.toFixed(1)}%`;

	const gate = [
		{
			when: 'Day 0',
			decision: 'HOLD',
			why: 'Old logs only. The old schedule never tried the timings the planner wants, so there is nothing to compare.'
		},
		{
			when: 'Days 7–28',
			decision: 'HOLD',
			why: 'Evidence builds up as a small share of retries try new timings.'
		},
		{
			when: 'Day 35',
			decision: 'HOLD',
			why: 'Enough evidence collected, but the gain could still be zero.'
		},
		{
			when: 'Day 42',
			decision: 'SWITCH',
			why: '+$2.04 per invoice, 95% interval +$0.39 to +$3.79. The planner takes over.'
		}
	];
</script>

<CaseStudy
	slug="recoup"
	summary="When a subscription payment fails, most businesses retry on a fixed timetable. Recoup works out the best moment to retry each payment, when to stop, and refuses to go live until the evidence says it is actually better. Built during my machine learning internship at Notzero Technologies."
>
	<section id="problem" aria-labelledby="problem-heading">
		<SectionHeading id="problem" index={1} title="The problem" />
		<p>
			A customer's card is declined on their monthly subscription. The business has three bad
			options: retry too soon and it fails again, retry too often and the customer gets annoyed and
			cancels, give up too early and the money is lost.
		</p>
		<p>
			The industry default is a fixed ladder: retry after <strong>1 day, then 3, then 7</strong>, applied
			to everyone, whatever the reason the payment failed. "The bank's system was down" and "the account
			is empty until payday" get exactly the same treatment.
		</p>
	</section>

	<section id="approach" aria-labelledby="approach-heading">
		<SectionHeading id="approach" index={2} title="The approach" />
		<p>Recoup replaces the ladder with five steps that run on every failed payment:</p>
		<Flow
			caption="From a failed payment to a retry decision, and the gate that decides which policy is live."
			steps={[
				{ title: 'Estimate', body: 'Is this customer gone for good, or just not funded yet?' },
				{ title: 'Plan', body: 'Score every possible retry schedule and pick the best one.' },
				{
					title: 'Explore',
					body: 'Try new timings on a small share of retries, and log each choice.'
				},
				{
					title: 'Evaluate',
					body: 'Estimate from the logs whether the planner beats the old ladder.'
				},
				{ title: 'Gate', body: 'Keep the old ladder live until the gain is proven.' }
			]}
		/>
		<h3>Two questions, not one</h3>
		<p>
			Most models ask "will this retry succeed?". Recoup splits that into "<strong
				>is the customer gone?</strong
			>" and "<strong>if not, when will they have the money?</strong>". Kept apart, the model stops
			retrying dead accounts and stops giving up early on live ones. Technically this is a
			mixture-cure survival model, shared across merchants so a small business with little history
			borrows what was learned from the others.
		</p>
		<h3>Plan the whole schedule</h3>
		<p>
			The best first retry depends on what you would do if it fails. Sometimes the right first move
			is a cheap early retry that mostly tells you whether the customer is still there. So Recoup
			scores every allowed schedule of up to four retries in closed form, inside the card networks'
			retry limits, rather than choosing one retry at a time.
		</p>
		<h3>Switch cautiously</h3>
		<p>
			A new policy that looks good on paper can still lose money. Recoup explores on a share of
			retries (20% by default), records the probability of every choice, and uses cross-fitted,
			doubly-robust off-policy evaluation to estimate the gain. A gate only switches when the 95%
			confidence interval on the improvement is above zero.
		</p>
	</section>

	<section id="results" aria-labelledby="results-heading">
		<SectionHeading id="results" index={3} title="Results" />
		<p>
			Measured on a simulated business: 9,000 failed invoices, 3,300 recurring customers, 12
			merchants and 6 markets. The percentages belong to the simulator; what transfers to a real
			business is the method.
		</p>
		<BarChart
			caption="Money recovered per failed invoice"
			format={usd}
			rows={[
				{ label: 'Fixed 1/3/7-day ladder', value: 12.12 },
				{ label: 'Smart timing, one retry at a time', value: 14.39, note: '+19%' },
				{
					label: 'Recoup: plan the whole schedule',
					value: 15.93,
					highlight: true,
					note: '+31%: for every $100 the ladder recovers, Recoup recovers about $131'
				}
			]}
		/>
		<p>
			About 40% of the gain comes from planning ahead rather than from the prediction model. To
			check the result was not an artefact of one simulated world, I re-ran it under six perturbed
			ones and refitted each time:
		</p>
		<BarChart
			caption="Gain over the fixed ladder, by simulated world"
			format={pct}
			rows={[
				{ label: 'Baseline world', value: 29.4 },
				{ label: 'No payday effect at all', value: 25.7, highlight: true },
				{ label: 'Payday lags 3 days', value: 19.8 },
				{ label: 'Payday spread wide', value: 23.2 },
				{ label: 'Payday spread narrow', value: 34.8 },
				{ label: 'Slow bank recovery', value: 29.4 },
				{ label: 'Customers drift faster', value: 33.8 }
			]}
		/>
		<p>
			Removing payday timing entirely barely moved the gain. The value comes from treating "the bank
			was down" differently from "insufficient funds", and from knowing when to stop.
		</p>
		<BarChart
			caption="Gain over the fixed ladder, by amount of history"
			format={pct}
			rows={[
				{ label: '1,500 failed invoices', value: 19.1, highlight: true, note: 'a small merchant' },
				{ label: '3,000 failed invoices', value: 20.7 },
				{ label: '6,000 failed invoices', value: 29.4 },
				{ label: '9,000 failed invoices', value: 31.7 }
			]}
		/>
	</section>

	<section id="rollout" aria-labelledby="rollout-heading">
		<SectionHeading id="rollout" index={4} title="Shipping it safely" />
		<p>
			On historical data alone, the gate says <strong>HOLD</strong>, and that is the correct answer.
			The old ladder almost never tried the timings the planner prefers, so old logs cannot prove it is
			better. In a 45-day simulated rollout the gate held while evidence built up, then switched:
		</p>
		<div class="my-6 overflow-x-auto rounded-md border border-hairline">
			<table class="w-full text-left text-sm">
				<thead class="bg-panel text-[11px] tracking-wider text-dim uppercase">
					<tr>
						<th scope="col" class="px-4 py-2 font-normal">When</th>
						<th scope="col" class="px-4 py-2 font-normal">Gate</th>
						<th scope="col" class="px-4 py-2 font-normal">Why</th>
					</tr>
				</thead>
				<tbody>
					{#each gate as row (row.when)}
						<tr class="border-t border-hairline align-top">
							<td class="px-4 py-3 whitespace-nowrap text-muted">{row.when}</td>
							<td
								class="px-4 py-3 font-semibold {row.decision === 'SWITCH'
									? 'text-accent'
									: 'text-fg'}">{row.decision}</td
							>
							<td class="px-4 py-3 font-sans text-muted">{row.why}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p>
			Exploring cost nothing measurable: invoices handled during HOLD earned $10.04 ± $1.24 each,
			against the ladder's expected $9.82. It ships as a command-line tool for scheduled jobs
			(retrain, plan, gate) and an operator console where you can see the gate's verdict, every
			logged decision, and why the planner chose a particular delay for an invoice.
		</p>
	</section>

	<section id="limits" aria-labelledby="limits-heading">
		<SectionHeading id="limits" index={5} title="Limitations and next steps" />
		<ul>
			<li>
				<strong>Everything is simulated.</strong> The method transfers; the percentages are the simulator's.
			</li>
			<li>
				<strong>The gate judges the first retry, but most of the gain comes later</strong> (+$0.42 on
				the first decision, +$3.81 on the whole schedule). Evaluating the whole schedule from the logs
				is the next step.
			</li>
			<li>
				<strong>The only action is choosing a delay.</strong> A pre-payday reminder, or trying the customer's
				other saved card, may be worth more and is not modelled yet.
			</li>
			<li>
				<strong>Small merchants mostly run the shared model.</strong> Below a few thousand failed invoices,
				a merchant gets a better ladder rather than a personal model, so this is really a payments-platform
				product.
			</li>
		</ul>
	</section>
</CaseStudy>
