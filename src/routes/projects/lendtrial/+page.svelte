<script lang="ts">
	import LendTrial from '$lib/components/LendTrial.svelte';
	import CaseStudy from '$lib/components/case-study/CaseStudy.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import { MAX_SCORE_FILE_BYTES, readScoreExport, type ScoreExport } from '$lib/lendtrial/import';

	let scoreExport = $state<ScoreExport | null>(null);
	let importMessage = $state('');
	let importing = $state(false);
	let importFailed = $state(false);
	let revision = $state(0);

	function loadScores(imported: ScoreExport, source: string) {
		scoreExport = imported;
		revision += 1;
		const count = imported.applications.length;
		importMessage = `Loaded ${count.toLocaleString('en-NG')} scored ${count === 1 ? 'application' : 'applications'}${source}.`;
	}

	async function importScores(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		importMessage = '';
		importFailed = false;
		importing = true;
		try {
			if (file.size > MAX_SCORE_FILE_BYTES) throw new Error('Choose a JSON file up to 2 MB.');
			loadScores(readScoreExport(await file.text()), '');
		} catch (error) {
			importFailed = true;
			importMessage = error instanceof Error ? error.message : 'Could not read this score export.';
		} finally {
			input.value = '';
			importing = false;
		}
	}

	async function loadSample() {
		importMessage = '';
		importFailed = false;
		importing = true;
		try {
			const response = await fetch('/projects/lendtrial-scores.json');
			if (!response.ok) throw new Error('The scored sample is temporarily unavailable.');
			loadScores(readScoreExport(await response.text()), ' from the sample');
		} catch (error) {
			importFailed = true;
			importMessage = error instanceof Error ? error.message : 'Could not load the scored sample.';
		} finally {
			importing = false;
		}
	}

	function resetScores() {
		scoreExport = null;
		importFailed = false;
		importMessage = 'Restored the synthetic demo cohort.';
		revision += 1;
	}
</script>

<CaseStudy
	slug="lendtrial"
	summary="A loan policy testing tool for a naira installment product. Replay a proposed cap on the same borrowers, then run a simulated pilot to see how first-payment misses could change."
>
	<section id="try-it" aria-labelledby="try-it-heading">
		<SectionHeading id="try-it" title="Run the demo" />
		<div class="mt-5">
			{#key revision}
				<LendTrial
					applications={scoreExport?.applications}
					model={scoreExport?.model}
					scoreSource={scoreExport
						? `Imported · ${scoreExport.model.type} / ${scoreExport.model.version}`
						: undefined}
				/>
			{/key}
		</div>
		<details class="mt-4 rounded-md border border-hairline bg-panel px-4 py-3">
			<summary class="cursor-pointer text-sm font-medium text-fg"
				>Load Can I borrow.ai scores</summary
			>
			<p class="mt-2 text-sm">
				Try a sample of synthetic applications scored by a pinned LightGBM artifact, or create a
				file with the <a
					href="https://github.com/Mocdew/Portfolio/tree/main/scripts/lendtrial"
					class="text-accent underline underline-offset-4">local Python exporter</a
				>. The browser reads imported files on your device.
			</p>
			<div class="mt-3 flex flex-wrap items-end gap-3">
				<button
					type="button"
					onclick={loadSample}
					disabled={importing}
					class="rounded border border-hairline px-2 py-1.5 text-xs text-fg hover:border-muted"
					>Load scored sample</button
				>
				<label class="grid max-w-full min-w-0 gap-1.5 text-sm text-fg">
					Score export (JSON)
					<input
						type="file"
						accept=".json,application/json"
						onchange={importScores}
						disabled={importing}
						class="max-w-full rounded border border-hairline px-2 py-1.5 font-sans text-xs file:mr-2 file:text-fg"
					/>
				</label>
				{#if scoreExport}
					<button
						type="button"
						onclick={resetScores}
						disabled={importing}
						class="rounded border border-hairline px-2 py-1.5 text-xs text-fg hover:border-muted"
						>Restore demo cohort</button
					>
				{/if}
			</div>
			<div aria-live="polite" aria-atomic="true" class="font-sans text-sm">
				{#if importMessage}
					<span class="mt-2 block text-muted"
						>{importFailed ? 'Import failed. ' : ''}{importMessage}</span
					>
				{/if}
			</div>
		</details>
	</section>

	<section id="decision" aria-labelledby="decision-heading">
		<SectionHeading id="decision" title="The decision" />
		<p>
			Raising the repeat-loan cap from ₦50,000 to ₦75,000 can offer borrowers more money. The risk
			team needs to know who would receive a higher offer, how much extra principal it would put
			forward, and what early repayment signal would make it pause the rollout.
		</p>
		<p>
			The replay gives both policies the same applications and reference scores. It requires at
			least one completed loan and a reference score of 25% or less. Each offer is capped at the
			amount requested. The CSV traces the portfolio totals back to individual decisions.
		</p>
	</section>

	<section id="pilot" aria-labelledby="pilot-heading">
		<SectionHeading id="pilot" title="How the pilot is evaluated" />
		<p>
			The simulator assigns borrowers whose offers would change to the current or candidate policy.
			It then generates acceptance, funding and payment events. A first-payment miss counts when the
			installment is still short seven days after its due date. Loans whose grace window is open
			appear as pending.
		</p>
		<p>
			On day 54, the pause rule compares the miss rates if both arms have enough loans past the
			grace window. If the candidate exceeds the threshold, new arrivals receive the current offer
			and the console continues to track borrowers already in the pilot. It also shows the share of
			assigned borrowers who missed a payment after completing follow-up.
		</p>
		<p>
			With the default synthetic cohort and a five percentage point threshold, the pilot continues
			without added repayment stress and pauses in the stress scenario. The minimum of 40 evaluable
			loans per group is a demo setting. A live experiment would need a sample size based on the
			baseline miss rate and the smallest change the lender wants to detect.
		</p>
	</section>

	<section id="scores" aria-labelledby="scores-heading">
		<SectionHeading id="scores" title="Where the scores come from" />
		<p>
			The default demo uses synthetic scores and repayment events. The Python exporter can use a
			pinned version of <a
				href="/projects/can-i-borrow"
				class="text-accent underline underline-offset-4">Can I borrow.ai</a
			>
			for reference scores. Both policy arms use the same score for each application, and payments remain
			simulated with imported scores. The original model was trained on undated records, so the demo does
			not establish repayment outcomes for a Nigerian lender.
		</p>
	</section>
</CaseStudy>
