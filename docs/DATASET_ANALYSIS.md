# Dataset Analysis Report: Kaggle Store Sales Data

## 1. Overview & File Metadata

- **File Path**: `kaggle dataset/store_sales_data (2).csv`
- **File Format**: CSV (Comma-Separated Values)
- **File Size**: ~19.1 MB (in-memory) / ~18.5 MB (on-disk)
- **Total Records (Rows)**: `100,000`
- **Total Fields (Columns)**: `25`
- **Missing Values**: `0` (0.00% missing across all columns)
- **Duplicate Rows**: `0`

---

## 2. Column Specifications & Data Inspection

| # | Column Name | Data Type | Non-Null Count | Unique Values | Sample Values / Description |
|---|---|---|---|---|---|
| 1 | `Customer ID` | String | 100,000 | 100,000 | `CUST000001`, `CUST000002` (Unique customer identifier) |
| 2 | `Customer Name` | String | 100,000 | 690 | `Curtis`, `Jeremy`, `Ariel`, `Colleen` (Customer first name) |
| 3 | `Last Name` | String | 100,000 | 1,000 | `Krause`, `Foster`, `Mccann`, `Maynard` (Customer surname) |
| 4 | `Date of Birth` | String (Date) | 100,000 | 24,536 | `1973-11-29`, `1987-08-30` (Range: 1950-01-01 to 2018-06-13) |
| 5 | `Sales` | Float64 | 100,000 | 98,976 | `3344.69`, `37094.41` (Monetary value in INR ₹) |
| 6 | `Year` | Int64 | 100,000 | 5 | `2019`, `2020`, `2021`, `2022`, `2023` |
| 7 | `Outlet Type` | String | 100,000 | 3 | `Large`, `Medium`, `Small` |
| 8 | `City Type` | String | 100,000 | 3 | `Tier 1`, `Tier 2`, `Village` |
| 9 | `Category of Goods` | String | 100,000 | 6 | `Fast Food`, `Electric Appliances`, `Dairy Products`, `Sessional Fruits & Vegetables`, `Furniture`, `Household Items` |
| 10 | `Region` | String | 100,000 | 4 | `East`, `South`, `West`, `North` |
| 11 | `Country` | String | 100,000 | 1 | `India` |
| 12 | `Segment` | String | 100,000 | 2 | `Consumer`, `Corporate` |
| 13 | `Sales Date` | String (Date) | 100,000 | 1,826 | `2023-03-11`, `2022-08-15` (Range: 2019-01-01 to 2023-12-31) |
| 14 | `Order ID` | String | 100,000 | 100,000 | `ORD000001`, `ORD000002` (Unique transaction order ID) |
| 15 | `Order Date` | String (Date) | 100,000 | 1,826 | `2020-04-13`, `2021-01-08` (Range: 2019-01-01 to 2023-12-31) |
| 16 | `Ship Date` | String (Date) | 100,000 | 1,832 | `2020-04-18`, `2021-01-11` (Range: 2019-01-02 to 2024-01-07) |
| 17 | `Ship Mode` | String | 100,000 | 4 | `Same Day`, `Standard Class`, `Second Class`, `First Class` |
| 18 | `State` | String | 100,000 | 10 | `West Bengal`, `Punjab`, `Gujarat`, `Delhi`, `Tamil Nadu`, `Rajasthan`, `Uttar Pradesh`, `Madhya Pradesh`, `Karnataka`, `Maharashtra` |
| 19 | `Postal Code` | Int64 | 100,000 | 10 | `700001`, `160001`, `380001`, `110001`, `600001` |
| 20 | `Product ID` | String | 100,000 | 100,000 | `PROD000001`, `PROD000002` (Unique product item code) |
| 21 | `Sub-Category` | String | 100,000 | 24 | `Burgers`, `Pizzas`, `Fans`, `Milk`, `Tomatoes`, etc. |
| 22 | `Product Name` | String | 100,000 | 21,365 | `Burgers - 718`, `Pizzas - 519`, `Fans - 395` |
| 23 | `Quantity` | Int64 | 100,000 | 10 | Discrete values from `1` to `10` |
| 24 | `Discount` | Float64 | 100,000 | 51 | Range: `0.00` to `0.50` (0% to 50% discount rate) |
| 25 | `Profit` | Float64 | 100,000 | 94,247 | `448.24`, `3134.34` (Monetary gross profit in INR ₹) |

---

## 3. Statistical Distribution of Key Numerical Fields

| Metric | Sales (₹) | Quantity | Discount | Profit (₹) | Profit Margin (%) |
|---|---|---|---|---|---|
| **Mean** | 25,084.41 | 5.49 | 0.25 (25.1%) | 3,755.31 | ~15.0% |
| **Std Dev** | 14,403.19 | 2.88 | 0.14 | 2,639.85 | ~8.4% |
| **Min** | 100.57 | 1 | 0.00 (0.0%) | 6.52 | ~0.1% |
| **25%** | 12,618.03 | 3 | 0.13 (13.0%) | 1,651.11 | ~9.2% |
| **Median (50%)**| 25,134.70 | 5 | 0.25 (25.0%) | 3,317.45 | ~14.1% |
| **75%** | 37,575.85 | 8 | 0.38 (38.0%) | 5,363.85 | ~19.8% |
| **Max** | 49,999.89 | 10 | 0.50 (50.0%) | 14,563.67 | ~58.2% |

---

## 4. Hierarchical Categorical Analysis

### Store Hierarchy Mapping
In the dataset, stores are implicitly defined by geographic location and physical store size:
- **States (10)**: `West Bengal`, `Punjab`, `Gujarat`, `Delhi`, `Tamil Nadu`, `Rajasthan`, `Uttar Pradesh`, `Madhya Pradesh`, `Karnataka`, `Maharashtra`
- **Postal Codes (10)**: `700001`, `160001`, `380001`, `110001`, `600001`, `302001`, `226001`, `462001`, `560001`, `400001`
- **Outlet Types (3)**: `Large` (Hypermarket / Flagship), `Medium` (Supermarket), `Small` (Convenience Store / Express Store)
- **City Types (3)**: `Tier 1` (Metro), `Tier 2` (Urban), `Village` (Rural / Semi-urban)
- **Regions (4)**: `East`, `South`, `West`, `North`

*Store Mapping Logic*: Each combination of `(State, Postal Code, Outlet Type, City Type)` maps to a unique physical Store entity in our relational schema.

### Product & Category Hierarchy
- **Categories of Goods (6)**:
  1. `Fast Food`
  2. `Electric Appliances`
  3. `Dairy Products`
  4. `Sessional Fruits & Vegetables`
  5. `Furniture`
  6. `Household Items`
- **Sub-Categories (24)**: e.g., Burgers, Pizzas, Fans, Milk, Tomatoes, Sofas, Lighting, etc.
- **Products (21,365 unique names)**: e.g., `Burgers - 718`, `Pizzas - 519`.

---

## 5. Identification of Financial Fields

### A. Available Dataset Fields (Actual Data)
- `Sales`: Gross monetary transaction amount per order item.
- `Profit`: Direct gross profit earned per order item.
- `Quantity`: Units sold per transaction.
- `Discount`: Applied percentage discount (0.0 to 0.50).
- `Order Date` / `Sales Date`: Date of transaction (2019 to 2023).

### B. Derived Financial Data
- `Revenue`: Equivalent to transaction `Sales` amount.
- `Cost of Goods Sold (COGS)`: Calculated as `Sales - Profit`.
- `Gross Profit Margin (%)`: Calculated as `(Profit / Sales) * 100`.
- `Unit Price`: `Sales / Quantity`.
- `Unit Cost`: `COGS / Quantity`.
- `Discount Amount`: `Sales * Discount`.

### C. Missing Financial Data (Requires Financial Assumption Layer)
The dataset contains transaction-level sales and gross profit, but lacks enterprise-level financial planning metrics:
- **Operating Expenses (OpEx)**: Store Rent, Marketing, Employee Salaries, Utilities, Freight & Logistics, Warehousing.
- **Budgets & Financial Targets**: Planned Revenue, Planned Operating Expenses, Planned Net Profit, Category/Store Allocation Budgets.
- **Net Profit**: Operating Profit after OpEx deduction (`Gross Profit - OpEx`).
- **Variance Metrics**: Historical Planned vs. Actual differences.
- **Risk Scores**: Standardized financial stress & budget overrun risk metrics.

These missing fields will be generated dynamically by a deterministic **Financial Assumption Engine** (`docs/FINANCIAL_ASSUMPTIONS.md`).
