# Financial Assumptions & Calculations Documentation

## 1. Executive Summary & Transparency Declaration

This document establishes the **Financial Assumption Layer** for the AI-Powered Retail Financial Planning Platform. 

While the Kaggle dataset provides granular transaction-level `Sales`, `Profit` (Gross Profit), `Quantity`, and `Discount` data across 100,000 orders, standard enterprise financial planning requires additional parameters such as **Operating Expenses (OpEx)**, **Planned Budgets**, **Net Profit**, **Variance Metrics**, and **Financial Risk Scores**.

> [!IMPORTANT]  
> **Transparency Declaration**: All missing operating expenses, planned targets, and budgets are calculated using deterministic, mathematically rigorous industry heuristics defined in this document. Simulated or derived financial elements are never falsely represented as native Kaggle dataset attributes.

---

## 2. Categorization of Financial Metrics

| Data Category | Financial Metric | Source / Method | Description |
|---|---|---|---|
| **Actual Dataset Data** | `Sales` | Kaggle CSV | Gross revenue per order line item |
| **Actual Dataset Data** | `Gross Profit` | Kaggle CSV | Direct transaction profit before operating expenses |
| **Actual Dataset Data** | `Quantity` | Kaggle CSV | Units sold per order item |
| **Actual Dataset Data** | `Discount` | Kaggle CSV | Percentage discount applied (0% - 50%) |
| **Derived Data** | `Revenue` | `Sales` | Transaction gross revenue |
| **Derived Data** | `COGS` | `Sales - Gross Profit` | Direct cost of goods sold |
| **Derived Data** | `Gross Profit Margin %` | `(Gross Profit / Sales) * 100` | Percentage gross profit margin |
| **Derived Data** | `Unit Price` | `Sales / Quantity` | Effective average price per unit |
| **Derived Data** | `Unit Cost` | `COGS / Quantity` | Cost per unit |
| **Assumption-Based Data** | `Operating Expenses (OpEx)` | Financial Engine Heuristics | Rent, Salaries, Marketing, Utilities, Logistics |
| **Assumption-Based Data** | `Net Profit` | `Gross Profit - OpEx` | Actual bottom-line profit |
| **Assumption-Based Data** | `Planned Revenue` | Baseline Sales * (1 + Target Growth) | Budgeted top-line target |
| **Assumption-Based Data** | `Planned Expenses` | Planned COGS + Planned OpEx Budget | Total allocated budget ceiling |
| **Assumption-Based Data** | `Planned Net Profit` | `Planned Revenue - Planned Expenses` | Target net profit |
| **Assumption-Based Data** | `Variance` | `Actual - Planned` | Performance deviation |
| **Assumption-Based Data** | `Financial Risk Score` | Composite Multi-Factor Formula | Risk metric ranging from 0 to 100 |

---

## 3. Operating Expense (OpEx) Modeling

Operating expenses are calculated at the transaction or store-period aggregation level using retail benchmark ratios:

### A. Fixed Rent Expense Heuristic
Store rent is determined based on physical `Outlet Type` and location `City Type`:

| Outlet Type | City Type | Base Monthly Rent (₹) |
|---|---|---|
| **Large** (Hypermarket) | Tier 1 (Metro) | ₹150,000 |
| **Large** (Hypermarket) | Tier 2 (Urban) | ₹110,000 |
| **Large** (Hypermarket) | Village (Semi-Urban)| ₹75,000 |
| **Medium** (Supermarket) | Tier 1 (Metro) | ₹90,000 |
| **Medium** (Supermarket) | Tier 2 (Urban) | ₹65,000 |
| **Medium** (Supermarket) | Village (Semi-Urban)| ₹40,000 |
| **Small** (Convenience) | Tier 1 (Metro) | ₹45,000 |
| **Small** (Convenience) | Tier 2 (Urban) | ₹30,000 |
| **Small** (Convenience) | Village (Semi-Urban)| ₹20,000 |

### B. Variable Operating Expense Allocation Ratios
Variable expenses are computed as a percentage of gross `Sales`:

1. **Marketing Expense**: `6.5%` of Sales
2. **Staffing & Employee Salaries**: `9.0%` of Sales
3. **Utilities (Electricity, Internet, Water)**: `2.5%` of Sales
4. **Logistics & Warehousing**: `3.5%` of Sales
5. **Miscellaneous / General Admin**: `1.5%` of Sales

$$\text{Total Variable OpEx} = 23.0\% \times \text{Sales}$$

$$\text{Total Operating Expenses (OpEx)} = \text{Fixed Rent} + \text{Total Variable OpEx}$$

$$\text{Net Profit} = \text{Gross Profit} - \text{Total OpEx}$$

$$\text{Net Profit Margin (\%)} = \left( \frac{\text{Net Profit}}{\text{Sales}} \right) \times 100$$

---

## 4. Financial Planning & Budget Generation Logic

For any given period (Monthly, Quarterly, Annual) and planning granularity (Store, Category, Business Unit, Organization):

### A. Planned Revenue Target
$$\text{Planned Revenue} = \text{Historical Baseline Sales} \times (1 + g)$$
Where growth factor $g$ is set between `0.05` (+5%) and `0.15` (+15%) based on category performance dynamics.

### B. Planned Operating Expense Budget
$$\text{Planned Expenses} = \text{Planned Revenue} \times (1 - \text{Target Net Profit Margin Rate})$$
Where standard Target Net Profit Margin Rate is assumed at `8.0%` to `12.0%`.

### C. Budget Allocations by Expense Category
- **COGS Budget**: `65.0%` of Planned Revenue
- **Marketing Budget**: `6.5%` of Planned Revenue
- **Operations & Salaries Budget**: `9.0%` of Planned Revenue
- **Rent & Facilities Budget**: `5.5%` of Planned Revenue
- **Utilities & Logistics Budget**: `4.0%` of Planned Revenue

---

## 5. Variance Analysis Formulas

| Variance Metric | Formula | Interpretation |
|---|---|---|
| **Revenue Variance** | $\text{Actual Revenue} - \text{Planned Revenue}$ | Positive (+) = Favorable, Negative (-) = Unfavorable |
| **Expense Variance** | $\text{Actual Expenses} - \text{Planned Expenses}$ | Negative (-) = Favorable, Positive (+) = Unfavorable (Over Budget) |
| **Profit Variance** | $\text{Actual Net Profit} - \text{Planned Net Profit}$ | Positive (+) = Favorable, Negative (-) = Unfavorable |
| **Margin Variance** | $\text{Actual Margin \%} - \text{Planned Margin \%}$ | Positive (+) = Favorable, Negative (-) = Unfavorable |
| **Budget Utilization %** | $\left(\frac{\text{Actual Expenses}}{\text{Planned Expenses}}\right) \times 100$ | > 100% = Over Budget Status |

---

## 6. Financial Risk Scoring Engine

The Financial Risk Score $R \in [0, 100]$ evaluates store or category vulnerability based on four core parameters:

$$R = 0.35 \cdot S_{\text{budget}} + 0.30 \cdot S_{\text{margin}} + 0.20 \cdot S_{\text{sales\_growth}} + 0.15 \cdot S_{\text{expense\_growth}}$$

Where:
- $S_{\text{budget}}$: Budget overrun score ($100$ if budget utilization $> 115\%$)
- $S_{\text{margin}}$: Profit margin compression score ($100$ if net profit $< 0$)
- $S_{\text{sales\_growth}}$: Sales trajectory decline score
- $S_{\text{expense\_growth}}$: Expense inflation rate relative to revenue growth

### Risk Classification Thresholds

| Risk Score Range | Risk Level | Operational Action Required |
|---|---|---|
| `0 <= R < 25` | **LOW** | Normal operations; perform routine monitoring |
| `25 <= R < 50` | **MEDIUM** | Moderate variance; review marketing & operational spend |
| `50 <= R < 75` | **HIGH** | Significant margin erosion; trigger budget restriction alerts |
| `75 <= R <= 100` | **CRITICAL** | Severe financial deficit; immediate cost restructuring required |
