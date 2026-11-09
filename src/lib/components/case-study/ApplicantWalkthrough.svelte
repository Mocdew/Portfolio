<script lang="ts">
	import { onMount } from 'svelte';
	import { applicants, loanAmounts, reviewThreshold } from '$lib/data/applicant-walkthrough';

	type Applicant = (typeof applicants)[number];
	const dollars = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	});
	const scaleMax = 30;
	let ready = $state(false);
	let applicant = $state<Applicant>(applicants[1]);
	let amountIndex = $state(loanAmounts.indexOf(applicants[1].originalAmount));
	const originalIndex = $derived(loanAmounts.indexOf(applicant.originalAmount));
	const loanAmount = $derived(loanAmounts[amountIndex]);
	const risk = $derived(applicant.risk[amountIndex]);
	const originalRisk = $derived(applicant.risk[originalIndex]);
	const difference = $derived(risk - originalRisk);
	const flagged = $derived(risk >= reviewThreshold);

	onMount(() => {
		ready = true;
	});

	function selectApplicant(next: Applicant) {
		applicant = next;
		amountIndex = loanAmounts.indexOf(next.originalAmount);
	}
</script>

<div class="rounded-md border border-hairline bg-panel p-4 sm:p-6">
	<div class="mb-6 max-w-prose">
		<p class="text-sm text-fg">Choose an applicant, then change only the loan amount.</p>
		<p id="sample-disclosure" class="mt-2 text-xs text-muted">
			This walkthrough uses fictional applicants and hand-authored risk estimates to show how the
			scoring interface works.
		</p>
	</div>

	<fieldset disabled={!ready} aria-describedby="sample-disclosure" class="min-w-0">
		<legend class="mb-2 text-xs font-semibold text-fg">Sample applicant</legend>
		<div class="grid gap-2 sm:grid-cols-3">
			{#each applicants as profile (profile.id)}
				<label class="block cursor-pointer">
					<input
						type="radio"
						name="sample-applicant"
						value={profile.id}
						checked={applicant.id === profile.id}
						onchange={() => selectApplicant(profile)}
						class="peer sr-only"
					/>
					<span
						class="flex min-h-11 items-center justify-center rounded border border-hairline px-3 py-2 text-center text-xs text-muted peer-checked:border-accent peer-checked:bg-accent/5 peer-checked:font-semibold peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-muted"
					>
						{profile.label}
					</span>
				</label>
			{/each}
		</div>
	</fieldset>

	<div class="mt-6 grid gap-5 sm:grid-cols-2">
		<div class="min-w-0">
			<dl class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 font-sans text-sm">
				<dt class="text-muted">Annual income</dt>
				<dd class="text-right text-fg tabular-nums">{dollars.format(applicant.income)}</dd>
				<dt class="text-muted">Credit score</dt>
				<dd class="text-right text-fg tabular-nums">{applicant.creditScore}</dd>
				<dt class="text-muted">Existing debt-to-income</dt>
				<dd class="text-right text-fg tabular-nums">{applicant.debtToIncome}%</dd>
			</dl>

			<div class="mt-6 border-t border-hairline pt-4">
				<div class="flex flex-wrap items-baseline justify-between gap-x-2">
					<label for="sample-loan-amount" class="text-xs font-semibold text-fg">Loan amount</label>
					<span class="text-sm text-fg tabular-nums">{dollars.format(loanAmount)}</span>
				</div>
				<input
					id="sample-loan-amount"
					type="range"
					min="0"
					max={loanAmounts.length - 1}
					step="1"
					value={amountIndex}
					disabled={!ready}
					aria-valuetext={dollars.format(loanAmount)}
					aria-describedby="sample-original-amount"
					oninput={(event) => (amountIndex = event.currentTarget.valueAsNumber)}
					class="block h-9 w-full cursor-pointer accent-accent"
				/>
				<div class="flex justify-between text-[11px] text-dim tabular-nums" aria-hidden="true">
					<span>{dollars.format(loanAmounts[0])}</span>
					<span>{dollars.format(loanAmounts[loanAmounts.length - 1])}</span>
				</div>
				<p id="sample-original-amount" class="mt-2 text-xs text-muted">
					Original request: {dollars.format(applicant.originalAmount)}
				</p>
			</div>
		</div>

		<div class="min-w-0 rounded border border-hairline bg-bg p-4">
			<div aria-live="polite" aria-atomic="true">
				<p class="text-xs font-semibold text-muted">Example default risk</p>
				<div class="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span class="text-3xl leading-none font-semibold text-fg tabular-nums">
						{risk.toFixed(1)}%
					</span>
					<span class="text-xs font-semibold {flagged ? 'text-accent' : 'text-muted'}">
						{flagged ? 'Flag for review' : 'Below review threshold'}
					</span>
				</div>
				<p class="mt-2 text-xs text-muted">
					{#if amountIndex === originalIndex}
						At the original loan amount.
					{:else}
						{Math.abs(difference).toFixed(1)} percentage points
						{difference > 0 ? 'higher' : 'lower'} than the original request ({originalRisk.toFixed(
							1
						)}%).
					{/if}
				</p>
			</div>

			<div class="relative mt-3 h-2 rounded-sm bg-hairline" aria-hidden="true">
				<div class="h-full rounded-sm bg-accent" style:width="{(risk / scaleMax) * 100}%"></div>
				<div
					class="absolute -inset-y-1 w-px bg-fg"
					style:left="{(reviewThreshold / scaleMax) * 100}%"
				></div>
			</div>
			<div class="mt-2 flex justify-between text-[11px] text-dim tabular-nums" aria-hidden="true">
				<span>0%</span>
				<span>{scaleMax}%</span>
			</div>
			<p class="mt-1 text-xs text-muted">
				Reference review threshold: {reviewThreshold}%
			</p>

			<div class="mt-4 border-t border-hairline pt-3">
				<p class="text-xs font-semibold text-fg">What drives the example</p>
				<ul class="mt-2 list-disc space-y-1 pl-4 text-xs">
					{#each applicant.factors as factor (factor)}
						<li>{factor}</li>
					{/each}
					<li>A larger request raises the monthly payment for the same income.</li>
				</ul>
			</div>
		</div>
	</div>
</div>
