<script lang="ts">
	import CaseStudy from '$lib/components/case-study/CaseStudy.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import { lendTrialUrl } from '$lib/data/projects';
</script>

<CaseStudy
	slug="lendtrial"
	summary="A loan policy testing tool for a naira installment product. Replay a proposed cap on the same borrowers, then run a simulated pilot to see how first-payment misses could change."
>
	<section id="try-it" aria-labelledby="try-it-heading">
		<SectionHeading id="try-it" title="Run the demo" />
		<p>
			<a href={lendTrialUrl} class="text-accent underline underline-offset-4">Open LendTrial</a>
			to compare caps, simulate a pilot, or load the scored sample.
		</p>
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
			The default demo uses synthetic scores and repayment events. The
			<a
				href="https://github.com/Mocdew/LendTrial/tree/main/scripts/lendtrial"
				class="text-accent underline underline-offset-4">Python exporter</a
			>
			can use a pinned version of
			<a href="/projects/can-i-borrow" class="text-accent underline underline-offset-4"
				>Can I borrow.ai</a
			>
			for reference scores. Both policy arms use the same score for each application, and payments remain
			simulated with imported scores. The original model was trained on undated records, so the demo does
			not establish repayment outcomes for a Nigerian lender.
		</p>
	</section>
</CaseStudy>
