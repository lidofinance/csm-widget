---
title: Why add a bond?
---

Adding bond is a prevention measure to avoid exit request for your validators if they became unbonded. [Unbonded validators](https://docs.lido.fi/staking-modules/csm/guides/unbonded-validators) appear if the Node Operator's bond is no longer sufficient to cover all of the validator keys uploaded to CSM by the Node Operator.

If a [penalty](https://operatorportal.lido.fi/modules/community-staking-module#block-3951aa72ba1e471bafe95b40fef65d2b) was already applied, there is a relatively short period of time until the next VEBO report, which most likely will contain a validator exit request. During this period in between penalty application and the next VEBO report, Node Operators must top-up bond to avoid exit requests for their validator(s).

**Warning:** If the unbonded validator has already been requested to exit, Node Operators can only exit it. The bond top-up after the exit request will not reverse the exit request.
