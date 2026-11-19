---
title: A store ratio beat three tuned boosting models
description: In the DSN qualification hackathon, one division explained most of the retail sales problem. Here's how I found it and why I shipped it over LightGBM, XGBoost and CatBoost.
date: 2026-11-12
tags: [forecasting, python, model-selection]
---

The DSN AI Bootcamp qualification hackathon asked for one number per row: total sales of a product at a store. The obvious move is to throw every feature at a gradient-boosted model, tune it and submit. I did that. Then I looked at the errors, and a much simpler model won.

## The feature that mattered

A product can have the same shelf price in a corner shop and a supermarket, but those two stores sell very different volumes. So instead of modelling sales directly, I divided observed sales by product price to compare turnover across stores.

The pattern was stark. The two corner shops recorded sales around **2.4 to 2.5 times** the product price. The eight larger stores ranged from about **14 to 26 times**. A single retail-wide rate could never capture that spread, but a per-store rate could.

That suggests a forecast you can write in one line:

```python
# A sketch of the idea, not the code from the repo.
rate = (train.sales / train.price).groupby(train.store).median()
forecast = test.price * test.store.map(rate)
```

## Stores the model has never seen

The catch is a store missing from the training data: there's no rate to look up. For those, I used a rate estimated from the store's _format_ as a starting point, so a new corner shop borrows from the other corner shops instead of from the supermarkets.

That one change took error on unseen stores from 1,436.6 RMSE down to 1,171.5.

## Checking it wasn't luck

A simple model that wins once can be a fluke of the split. So I compared the store-ratio model with tuned LightGBM, XGBoost and CatBoost on the **same validation folds**, repeating the five-fold split:

| Model             | RMSE (lower is better) |
| ----------------- | ---------------------- |
| Store ratio       | 1,070.8                |
| Tuned boosting ×3 | 1,097 – 1,101          |

The model also gives a range around each forecast. Its 80% prediction intervals contained 79.7% of observed sales in the evaluation, which is about as close to "says what it means" as you can hope for. The submission placed 27th on Kaggle.

## What I'd check next

The data covers ten stores, only two of them corner shops, so the format rate is a starting estimate, not a settled fact. With more stores and dated observations I'd measure error and interval coverage by format, and on a later time period where a shift in demand could expose weak rates.

The broader lesson I keep relearning: **look at the residuals before reaching for a bigger model.** Sometimes the structure is sitting in one ratio.

The full write-up, with the store chart, is in the [DSN Hackathon case study](/projects/dsn-hackathon).
