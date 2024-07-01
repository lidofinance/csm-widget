---
title: 'Why upload a bond?'
---

Uploading a bond serves as a risk mitigation measure for both the Ethereum network and the Lido protocol.

There are several major reasons for a CSM Node Operator's bond to be penalized, including:

- **The validator has been slashed.** In this case, the initial (minimal) slashing penalty is confiscated. `Penalty amount` = `1 ETH (EFFECTIVE_BALANCE / 32)`;
- **The operator has stolen EL rewards (MEV)**. `Penalty amount` = `amount stolen` + `fixed stealing fine`;
- **The validator's withdrawal balance is less than 32 ETH**. `Penalty amount` = `32` - `validator's withdrawal balance`;
