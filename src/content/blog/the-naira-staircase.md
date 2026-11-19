---
title: The naira falls off cliffs
description: I looked at 66 years of the naira's exchange rate against the US dollar. It almost never slides down slowly. It sits still for years, then drops in a single month, nearly always because of a government decision.
date: 2026-11-19
tags: [forecasting, volatility, time-series]
---

I'm based in Lagos, and I've forecast the volatility of [Brent crude](/#brent-volatility) and [EUR/USD](/#eurusd-volatility). The naira against the dollar was the obvious next one to study. So I pulled every month of the official rate back to independence, along with daily market prices and oil prices, and ran the same kind of models on it. The shape of the answer surprised me: the naira doesn't slide, it falls off cliffs.

<figure>
	<img
		src="/blog/the-naira-staircase/exchange-rate-1960-2026.webp"
		alt="Line chart of the naira price of one US dollar from 1960 to 2026 on a log scale. The line is flat for long stretches and jumps in steps, with marked jumps in October 1986, January 1999, the 2016 float and February 2024, ending at ₦1,353 in August 2026."
		width="1200"
		height="560"
	/>
	<figcaption>
		<strong>The price of one US dollar in naira, 1960–2026.</strong> The line climbs in steps, not a smooth slope. Each gridline is ten times the one below it, so the early years stay visible. Before 1973 Nigeria used the pound; those values are converted at £1 = ₦2. Shaded bands mark the different policy periods.
	</figcaption>
</figure>

In 1960, one US dollar cost the equivalent of 71 kobo. In August 2026 it cost **₦1,353**, about 1,900 times as much.

You might expect a rise that large to happen gradually, a little each month. It didn't. In **more than a third of all months since 1960 (36%), the official rate did not change at all**. Most of the fall happened in a handful of months. In January 1999 the dollar's price almost quadrupled, from ₦21.89 to ₦85.57. In October 1986 it nearly tripled. In March 1992 it jumped by about 70%, and in February 2024 by about 60%. Each of those jumps followed a government or central bank decision.

| Number     | What it measures                                               |
| ---------- | -------------------------------------------------------------- |
| **×1,894** | How much more a dollar costs now than in 1960                  |
| **36%**    | Months since 1960 when the official rate did not move at all   |
| **×3.9**   | The biggest one-month jump in the dollar's price, January 1999 |
| **~3%**    | The naira's typical yearly swing today, the calmest since 2023 |

## The rules decide how wild the naira gets

Since independence, Nigeria has changed the way it manages the naira about ten times. Sometimes the rate was fixed by the government, sometimes it was set at auctions, and sometimes it was left to the market. I measured how much the naira swung around under each of these policy periods. Economists call this swing **volatility**. Between the calmest period and the wildest, it differs by **more than 50 times**.

<figure>
	<img
		src="/blog/the-naira-staircase/swing-by-policy-period.webp"
		alt="Bar chart of the typical yearly swing under ten policy periods. Highest: the 1999 rate merger era at 72.6%, Structural Adjustment at 48.7% and today's unified market at 36.1%. Lowest: the Nigerian pound at 1.7% and the ₦21.886 freeze at 1.3%."
		width="1200"
		height="587"
		loading="lazy"
	/>
	<figcaption>
		<strong>How much the naira swung under each set of rules.</strong> The typical yearly swing in the exchange rate under each policy period. Orange marks the most turbulent periods. The 1999–2002 figure comes almost entirely from one month, the January 1999 jump.
	</figcaption>
</figure>

The calmest periods were when the rate was fixed: the Nigerian pound in the 1960s, and the five years from 1993 to 1998 when the official rate was frozen at ₦21.886. The wildest were the moments when the government stopped holding the rate and let it move. That happened under the 1986 Structural Adjustment Programme, at the 1999 merger of the official and market rates, and at the 2023 unification.

The current system, which started in June 2023, is the first on record in which the rate **moved every single month**. For the first time, the official naira behaves like a price set in a market.

### Even the calm was a decision

The quiet years were as much a policy choice as the sudden drops. I gave a model only the monthly numbers, with no dates or history, and asked it to sort the months into “frozen” and “moving”. It found the political history on its own: the 1993–98 freeze, the 2015–16 hold at ₦197, and the long stretch in 2018–20 when the official rate was parked while most business went through other windows.

I then ran a separate test that searches the data for turning points. It found the biggest ones in 1978, mid-1993, January 1999, 2004 and June 2023. Three of those five fall within a month of a known policy change.

## Shocks fade faster than they seem to

The standard models used to forecast currency swings assume that a burst of turbulence fades slowly, like ripples on a pond. When I ran them on the naira without telling them about the policy changes, they concluded the ripples never fade: one big shock would keep the naira jumpy forever.

That conclusion is wrong. Once I told the models that each policy period has its own normal level of turbulence, a shock faded in months. **Half of its effect is gone within 2 to 18 months**, depending on the model. What looked like a long memory was really the long life of each policy period.

The models showed me one more pattern. A sharp fall in the naira makes the following months more nervous, while a sharp rise does not. When the naira drops, people expect it may drop again.

## Oil matters, but not in the way people think

Oil earns about nine-tenths of Nigeria's export income, so it is natural to blame oil prices for the naira's swings. My numbers lean the expected way: after oil prices fall, the naira tends to be a little more unsettled, and after they rise, nothing much happens. But once I took the policy changes into account, the effect was small and not reliable.

Oil does its damage another way. The oil-price crashes of 2008–09, 2014–16 and 2020 all reached the naira **months later, through official devaluations**. The shock arrived as a government decision, not as day-to-day market turbulence.

## Where the naira stands now

<figure>
	<img
		src="/blog/the-naira-staircase/swing-since-unification.webp"
		alt="Bar chart of the naira's typical yearly swing for each quarter from mid-2023 to late 2026. It peaks at 141.8% in the second quarter of 2023 and 74.7% in early 2024, then falls steadily to 2.9% in the latest quarter."
		width="1200"
		height="454"
		loading="lazy"
	/>
	<figcaption>
		<strong>How much the naira has swung since the 2023 unification.</strong> The typical yearly swing, measured from daily prices, for each three-month period. Orange marks the most turbulent quarters.
	</figcaption>
</figure>

The first year after the June 2023 unification was rough. Measured day to day, the naira's typical yearly swing was above 140% in the first weeks and 75% in early 2024. In early 2024 a change in how the official rate was calculated pushed the dollar's price up by about a third in a single day. Since the new electronic trading system started in December 2024, the market has calmed sharply. In the latest quarter the swing is **about 3% a year**, the calmest since unification.

For the next two weeks, my best model expects the calm to continue. Starting from ₦1,345 to the dollar on 17 November 2026, it puts the rate between **about ₦1,327 and ₦1,364**, with 95% confidence. I also tested the model on the previous eight months: its warnings about how far the naira might fall were right about as often as they should have been.

<figure>
	<img
		src="/blog/the-naira-staircase/forecast-next-12-months.webp"
		alt="Line chart of the expected yearly swing from September 2026 to August 2027. The main forecast eases from about 11% to 9%. The pessimistic scenario rises from about 9% to 25%. A dashed line marks the past twelve months at 6.1%."
		width="1200"
		height="454"
		loading="lazy"
	/>
	<figcaption>
		<strong>Two views of the next 12 months.</strong> Expected yearly swing, September 2026 to August 2027. The dashed line shows the past twelve months, about 6%.
	</figcaption>
</figure>

For the coming year I show two views. The **main forecast** expects the swing to settle at around 9–11% a year. That is livelier than the past twelve months but far calmer than 2023–24. The **pessimistic scenario** climbs to about 25% a year, because it assumes the next year will look like the average of the whole period since 2023, including its two upheavals.

## What I take from this

- **Waiting makes it worse.** The naira's worst months were adjustments that had been put off and then made all at once. A rate that moves a little every month avoids the cliff. The current system, with no frozen months and calmer swings since late 2024, is the first long test of that idea.
- **Trust calms the market.** Because the naira's jumpiness is tied to policy periods, the best way to keep it calm is a system people expect to last. Under a trusted system, shocks fade within months.
- **Reserves protect against oil shocks.** Oil crashes hurt the naira through the forced devaluations that follow them. Foreign-currency reserves large enough to avoid those devaluations protect the naira where it is most exposed.
- **Plan for both calm and storm.** Businesses and banks that look only at the calm of 2025–26 will underestimate the risk of another policy change. Those that look only at the full history will overestimate everyday risk. I use both views, and I'd suggest you do too.

## About the data

For the monthly figures I used the official central bank rate, as published by the Bank for International Settlements. During periods with several exchange rates (the late 1990s and 2017–2023), the rates people actually paid, including on the street, moved far more, so those periods look calmer here than they were. The daily figures are market prices published by Yahoo Finance; I removed three obvious errors. Oil prices come from the US Federal Reserve's FRED database. I could only get inflation yearly, and I couldn't get foreign reserves at all. By “swing” I mean the annualised standard deviation of price changes. I built the forecasts and tests in a reproducible Python notebook, using GARCH and regime-switching models.
