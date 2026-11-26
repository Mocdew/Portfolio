---
title: 'The naira is calm. Will it last?'
description: "The naira's daily swings have shrunk from 75% a year in early 2024 to about 3%. I ran short-term and 12-month forecasting models to see what comes next—and why the long-run models disagree."
date: 2026-11-26
tags: [forecasting, volatility, time-series]
image: /blog/the-naira-is-calm-will-it-last/preview.png
imageAlt: 'Two charts of naira volatility: daily annualised volatility in 2026 with a 10-day forecast on the left, and monthly volatility since 2019 with two diverging 12-month forecasts on the right.'
---

If you were importing goods, paying school fees abroad, or holding naira savings through most of 2024, you probably remember the stress. The exchange rate could swing by 10% in a single day. On 1 February 2024 alone, the price of a dollar in naira jumped nearly 29% from one day's close to the next. In the first three months of that year, daily swings were so wild that, stretched over a full year, they equalled a volatility rate of about 75%.

Two and a half years later, the naira looks almost unrecognizable. Between October and mid-November 2026, those same daily swings had shrunk to an annual pace of just **3%**. On 17 November 2026, the rate closed at **₦1,345.38 per dollar**, with the smallest day-to-day movements since Nigeria unified its exchange rates in June 2023.

The big question now isn't how we got here. It's what happens next.

To find out, I ran forecasting models over two timeframes: the **next two weeks** and the **next twelve months**. The short-term outlook is calm and fairly clear. The one-year outlook, however, splits into two very different predictions, and understanding _why_ they disagree is the most useful takeaway for anyone planning ahead.

---

## First, what do these forecasts actually measure?

In plain terms, **volatility** measures _how bumpy the ride is_, not which way the road turns. A volatility forecast does not tell you whether the naira will get stronger or weaker. Instead, it tells you how wide a price range you should be ready for, whether you're budgeting for a trip, pricing inventory, or managing business cash flow.

To build the forecasts, I looked at two sets of data:

1. **For the next two weeks:** Daily closing exchange rates from 15 June 2023 to 17 November 2026 (886 trading days, after cleaning out three obvious data glitches). I tested nine different short-term forecasting models that predict tomorrow's swings based on how much the rate has been moving lately.
2. **For the next twelve months:** Official monthly exchange rates published by the Bank for International Settlements up to August 2026. Here, I compared two models with very different "worldviews":
   - **The "back-to-average" model:** It treats everything since June 2023 as one era and assumes that, over time, the naira's turbulence will drift back toward the average level of bumpiness seen across that whole period.
   - **The "two-moods" model:** It assumes the naira switches between two distinct states (a relatively "frozen" state and an actively "moving" state) and uses 40 years of history (since 1986) to estimate the odds of switching from one to the other.

---

## Did the short-term model actually pass the test?

Before trusting any forecast, you have to check if it works on real days it has never seen. So I hid the most recent 178 trading days (13 March to 17 November 2026) from all nine short-term models, trained them only on older data, and asked them to predict each next day's movement one day at a time.

<figure>
	<img
		src="/blog/the-naira-is-calm-will-it-last/oos-forecasts.png"
		alt="Daily volatility forecasts from the two best models against the actual size of daily moves, March to November 2026."
		width="1418"
		height="516"
	/>
	<figcaption>
		Grey bars show how much the naira actually moved each day. The red and blue lines show what the top two models predicted the day before. Both tracked the 2026 slowdown closely.
	</figcaption>
</figure>

Three lessons stood out from that test:

- **Simpler beat flashier.** The top-performing model was a straightforward one that tracks recent daily swings while giving slightly different weight to upward vs. downward moves. Meanwhile, the complex model that looked "smartest" on old historical data finished **8th out of 9** when predicting the future, because it had over-fitted to past quirks. Another complicated model broke down completely during testing.
- **The models still have a slight "hangover" from 2024.** Every model predicted slightly bigger swings than actually happened (the best one expected 0.35% daily moves on average, compared to 0.32% in reality). The memory of 2024's chaos fades slowly.
- **Worst-case warnings held up.** When checking how often the naira fell _more_ than the winning model's "95% safe" or "99% safe" daily limits, the actual number of surprises matched expectations. The only blind spot was in mid-March 2026, when the naira strengthened several days in a row faster than the model expected.

---

## The next two weeks: steady and narrow

Using all 886 days of data up to 17 November 2026, the winning model estimates the naira's current daily swing at **0.20% a day** (about **3.2% a year**), which matches the 0.21% daily average seen over the previous 60 trading days.

Over the following ten trading days (through 1 December 2026), it expects that daily swing to nudge up slightly from 0.20% to 0.23%, not because a shock is coming, but simply because statistical models naturally drift slightly back toward their longer-term baseline.

| Timeframe from 17 Nov 2026 | Typical daily move | Annual pace | Combined swing over the period |
| -------------------------- | -----------------: | ----------: | -----------------------------: |
| 1 day (18 Nov)             |             0.201% |        3.2% |                          0.20% |
| 5 days (24 Nov)            |             0.215% |        3.4% |                          0.47% |
| 10 days (1 Dec)            |             0.231% |        3.7% |                          0.68% |

**What that means in naira:** Over those ten trading days, there is roughly a 95% chance (a 19-in-20 chance) the rate stays between **₦1,327.50 and ₦1,363.50 per dollar**, a band of about ₦36, or **±1.3%**.

For anyone who had to budget around 10% daily swings in 2024, that is remarkably calm. Just keep in mind: this assumes no sudden policy announcement drops in the middle of those two weeks.

---

## The next twelve months: two models, two very different stories

Looking a full year ahead (September 2026 to August 2027), the two monthly models disagree sharply.

<figure>
	<img
		src="/blog/the-naira-is-calm-will-it-last/forecast-paths.png"
		alt="Left: daily annualised volatility in 2026 with the 10-day forecast. Right: monthly volatility since 2019 with the two 12-month forecasts to August 2027."
		width="1528"
		height="516"
	/>
	<figcaption>
		Right chart: The red "back-to-average" line climbs steadily back toward post-2023 turbulence. The green "two-moods" line gently eases down.
	</figcaption>
</figure>

| Month                    | "Back-to-average" model | "Two-moods" model |
| ------------------------ | ----------------------: | ----------------: |
| September 2026           |             9.5% a year |      11.2% a year |
| December 2026            |                   16.2% |             10.0% |
| February 2027            |                   19.2% |              9.5% |
| May 2027                 |                   22.6% |              9.3% |
| August 2027              |                   25.3% |              9.2% |
| **Total 12-month swing** |               **19.5%** |          **9.8%** |

Why do they disagree so much?

- **The "back-to-average" model expects turbulence to return.** Because it lumps everything since June 2023 into one era, its long-run average includes the massive 2023 unification shock and the February 2024 jump, giving that era an average volatility of **41% a year**. Since shocks in this model take about 18 months to fade halfway, it keeps pulling today's calm rate back up toward that bumpy average.
- **The "two-moods" model expects the calm to settle in.** It sees that the official rate is currently in its "moving" mood, but based on 40 years of naira patterns, it expects the currency to gradually calm down, lowering the odds of staying in that volatile mood from 100% to about 57% over the year. As a result, its forecast drifts down from 11% to about 9%.

To see what this gap looks like in real money, here is each model's rough **95% price range** for August 2027, starting from the August 2026 average of **₦1,353 per dollar** (assuming no steady upward or downward trend):

| Model                                   | Rough 95% range for August 2027 |
| --------------------------------------- | ------------------------------- |
| **Two-moods model** (9.8% swing)        | **₦1,117 – ₦1,640**             |
| **Back-to-average model** (19.5% swing) | **₦923 – ₦1,983**               |

One model's uncertainty range is roughly **twice as wide** as the other's.

---

## Which one should you plan around?

Think of the **two-moods model as your main plan**, and the **back-to-average model as your stress test**.

The two-moods forecast (9–11%) lines up much better with what is actually happening right now. Over the year ending August 2026, monthly volatility was about **6%**, and daily swings in the second half of 2026 were around 3%–3.4%. Reaching 25% volatility by mid-2027 would require a return to something like 2024's turmoil.

_(Side note: Why is the daily model around 3% while the monthly model is 9–11%? Because small, steady moves in the same direction, like the naira gently strengthening in 8 of the 12 months leading up to August 2026, add up over a month in a way that a day-to-day snapshot misses.)_

Still, you shouldn't ignore the rougher forecast. In Nigeria's 60-year currency history (from the 1993–98 freeze, to the 2015–16 peg at ₦197, to the 2018–20 multiple-window era), calm stretches have rarely ended slowly. They usually ended with a sudden policy change. The back-to-average model is a useful reminder of how wide things can get if history repeats itself.

---

## What this means for you

- **For short-term payments and pricing (next 1–2 weeks):** Conditions are unusually predictable. A ±1.3% buffer around the current rate is a reasonable working assumption right now.
- **For annual budgets and contracts:** Build your main budget around the calmer scenario, meaning the naira could plausibly end a year from now within roughly **±20%** of today's rate. Then stress-test your business to make sure it could survive a **±40%** swing if turbulence returns.
- **Don't mistake a quiet stretch for a permanent guarantee:** The two models disagree on one core question: is this calm the naira's _new normal_, or just a quiet pause inside a bumpy system? Because the post-2023 system is only three and a half years old (and spent most of that time recovering from its launch), the data simply can't settle that debate yet.

---

## Important things to keep in mind

- **Direction isn't predicted:** None of these numbers say whether the naira will gain or lose value, only how big the swings could be.
- **Models can't read policymakers' minds:** The biggest naira moves in history came from government or central bank decisions, which statistical models only see _after_ they happen.
- **Recent data has been calm:** Models tested during a quiet 2026 naturally look accurate right now, but they can underestimate risk if a 2024-style shock suddenly hits.
- **Official rate only:** The 12-month numbers track the official exchange rate, not parallel-market rates or how easy it is to actually buy dollars at the official price.

We will find out very soon how the 10-day forecast holds up, as that window closes on 1 December 2026. The 12-month forecasts will take until next August to play out, and when they do, they'll help answer whether the naira's newfound calm is truly here to stay.
