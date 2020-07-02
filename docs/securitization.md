# Securitization

Information about a proposed asset-backed financing.

[View the JSON schema](../dist/schemas/securitization.schema.json)



## name


**Type: `string`**
Unique name of this security


## symbol


**Type: `string`**
Ticker symbol for secondary market trading


## currency

**See: [iso-4217-currency-code.md](iso-4217-currency-code.md)**

## maximumAmount


**Type: `number`**
Maximum net assets of this securitization (amount being financed) tranche


## minimumInvestmentAmount


**Type: `number`**
Minimum per investment subscription allowed into this tranche.


## trancheNumber


**Type: `integer`**
Number of the funding traunch. Security may have more than one tranche, but will always have at least one tranche.


## amountSubscribedCurrent


**Type: `number`**
Amount of funds committed but not yet funded for this current tranche


## amountFundedCurrent


**Type: `number`**
Net funding already received for this tranch'


## amountFundedPrevious


**Type: `number`**
Total net funded in all previous traunches


## tenure


**Type: `integer`**
Duration of the contract (in months)


## rating


### One Of

Must match exactly one of any of the following schemas:


#### KsppsBlossomCreditRating

Credit rating assigned by Blossom based on due diligence

[View the JSON schema](../dist/schemas/kspps-blossom-credit-rating.schema.yml)








## projectedGrossAROI


**Type: `number`**
Weighted expected profit rate


## issuer

**See: [issuer.md](issuer.md)**
<!-- END of schema.properties.forEach -->


