---
title: Building a model that refuses to go live
description: Recoup plans payment retries better than a fixed 1/3/7-day ladder in simulation. The most important part is the gate that keeps it switched off until real evidence says so.
date: 2026-11-19
tags: [payments, causal-inference, mlops]
---

When a subscription payment fails, most businesses retry on a fixed ladder: after **1 day, then 3, then 7**, for every customer, whatever the reason the payment failed. During my internship at Notzero Technologies I built Recoup to replace that ladder. In simulation it recovers about 31% more per failed invoice.

This post isn't about that number. It's about the part of the system whose job is to _not trust_ it.

## Old logs can't prove a new policy

Here's the trap. You train a model on historical payment logs, it proposes new retry timings, and an offline evaluation says it's better. Ship it?

The problem is that the old ladder almost never tried the timings the new planner prefers. If retrying on day 2 was never attempted, the logs contain no evidence about what happens on day 2. Any estimate of the planner's value there is extrapolation.

So on historical data alone, Recoup's gate says **HOLD**. That is the correct answer.

## Explore a little, log everything

To earn the right to switch, Recoup explores on a share of retries (20% by default) and records the probability of every choice it makes. Those logged probabilities are what make the evaluation honest: with them, cross-fitted, doubly-robust off-policy evaluation can estimate how the planner would have done on invoices it didn't control.

The gate rule itself is deliberately boring:

```python
# Switch only when the whole 95% interval on the gain sits above zero.
def gate(gain_low: float, gain_high: float) -> str:
    return "SWITCH" if gain_low > 0 else "HOLD"
```

## What the rollout looked like

In a 45-day simulated rollout:

| When      | Gate   | Why                                                  |
| --------- | ------ | ---------------------------------------------------- |
| Day 0     | HOLD   | Old logs only; nothing to compare against.           |
| Days 7–28 | HOLD   | Evidence builds as a small share of retries explore. |
| Day 35    | HOLD   | Enough data, but the gain could still be zero.       |
| Day 42    | SWITCH | +$2.04 per invoice, 95% interval +$0.39 to +$3.79.   |

And exploring cost nothing measurable: invoices handled during HOLD earned $10.04 ± $1.24 each, against the ladder's expected $9.82.

## Honest limits

- **Everything is simulated.** The method transfers; the percentages belong to the simulator.
- **The gate judges the first retry**, but most of the gain comes later (+$0.42 on the first decision, +$3.81 on the whole schedule). Evaluating the whole schedule from logs is the next step.
- **The only action is choosing a delay.** A pre-payday reminder or trying another saved card might be worth more, and isn't modelled yet.

A model that's better on paper and a model you should switch on are different claims. Building the second one is most of the work.

More detail, including the stress tests across six simulated worlds, is in the [Recoup case study](/projects/recoup).
