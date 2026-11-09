const { db } = require('../config/database');
const { getSpecificLocation } = require('../utils/storeLocationMetadata');

const CITY_CLUSTER_METADATA = {
  'Delhi': {
    city_name: 'Delhi NCR',
    primary_hub: 'Connaught Place / Central Delhi (PIN 110001)',
    expansion_recommendation: {
      target_location: 'South Delhi / Saket (Select Citywalk & Press Enclave Catchment)',
      alternative_location: 'Dwarka Sector 12 Metro Hub',
      recommended_format: 'Compact Gourmet & Fresh Supermarket (4,500 sq ft)',
      target_demographic: 'High-income double-earner households with 3.8x basket spend for fresh organic food, gourmet packaged goods, and dairy',
      projected_year1_revenue: 32000000,
      projected_year1_ebitda: 4150000,
      projected_margin_pct: 13.0,
      estimated_capex: 3200000,
      breakeven_months: 12,
      cannibalization_risk: 'Low (< 2.8% overlap; 16 km distance from CP store)',
      strategic_rationale: 'Capture underserved affluent residential density in South Delhi where quick-commerce and gourmet grocery demand yields 28% higher gross margins than Central Delhi commercial zone.'
    },
    closure_rationale: {
      default_candidate_type: 'Small',
      closure_trigger: 'Excessive high-street commercial lease rent in Connaught Place (110001) combined with space-inefficient bulky inventory (appliances/furniture) and 26.2% discount leakage in a 3,200 sqft footprint.',
      lease_savings_annual: 1725000,
      staff_redeployment_plan: 'Transfer Store Manager and 6 customer associates to the nearby STR-DELH-110001-M supermarket and new Saket expansion site with zero involuntary headcount termination.',
      inventory_transfer_plan: 'Transfer 82% fast-moving packaged food inventory to STR-DELH-110001-M; liquidate remaining aged non-food goods via structured 21-day clearance sale.'
    }
  },
  'Maharashtra': {
    city_name: 'Mumbai MMR',
    primary_hub: 'South Mumbai / Fort (PIN 400001)',
    expansion_recommendation: {
      target_location: 'Navi Mumbai (Seawoods Grand Central / Palm Beach Corridor)',
      alternative_location: 'Thane West (Ghodbunder Road)',
      recommended_format: 'Family Fresh Supermarket (5,200 sq ft)',
      target_demographic: 'Young upwardly mobile families in modern residential complexes seeking weekly fresh grocery and FMCG baskets',
      projected_year1_revenue: 36500000,
      projected_year1_ebitda: 4800000,
      projected_margin_pct: 13.2,
      estimated_capex: 3600000,
      breakeven_months: 13,
      cannibalization_risk: 'Negligible (< 1.5% overlap; 28 km trans-harbour distance from South Mumbai)',
      strategic_rationale: 'Tap into booming suburban Navi Mumbai residential expansion where commercial floor rentals are 45% lower than South Mumbai with 2.2x higher weekend footfall density.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'Hypermarket format in high-cost South Mumbai commercial district operating at negative EBITDA due to prohibitive commercial rent and low residential grocery footfall.',
      lease_savings_annual: 2250000,
      staff_redeployment_plan: 'Redeploy floor associates to the high-density suburban Navi Mumbai expansion store.',
      inventory_transfer_plan: 'Consolidate inventory into STR-MAHA-400001-M supermarket hub.'
    }
  },
  'Karnataka': {
    city_name: 'Bengaluru Metro',
    primary_hub: 'Bengaluru CBD / MG Road (PIN 560001)',
    expansion_recommendation: {
      target_location: 'Whitefield (ITPL Main Road / Hopefarm Catchment)',
      alternative_location: 'Electronic City Phase 1',
      recommended_format: 'Tech-Express Smart Supermarket (4,800 sq ft)',
      target_demographic: '85,000+ tech professionals and gated community residents with high weekend basket size and digital app adoption',
      projected_year1_revenue: 34500000,
      projected_year1_ebitda: 4520000,
      projected_margin_pct: 13.1,
      estimated_capex: 3400000,
      breakeven_months: 11,
      cannibalization_risk: 'Low (< 2.0% overlap; 18 km distance from CBD)',
      strategic_rationale: 'Establish dominant presence in Eastern tech corridor where per-capita FMCG and organic food spend is 42% above city average.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'Central CBD hypermarket suffering EBITDA deficit due to extreme lease overhead and severe parking congestion restricting family shopping trips.',
      lease_savings_annual: 2050000,
      staff_redeployment_plan: 'Transfer staff to Whitefield smart supermarket and STR-KARN-560001-M store.',
      inventory_transfer_plan: 'Transfer inventory into regional cross-dock distribution center.'
    }
  },
  'Tamil Nadu': {
    city_name: 'Chennai Metro',
    primary_hub: 'George Town / Parry\'s CBD (PIN 600001)',
    expansion_recommendation: {
      target_location: 'OMR - IT Corridor (Thoraipakkam / Sholinganallur)',
      alternative_location: 'Velachery Bypass Road',
      recommended_format: 'Compact Fresh Supermarket (4,600 sq ft)',
      target_demographic: 'Young tech workforce and modern apartment residents demanding ready-to-cook fresh foods and dairy',
      projected_year1_revenue: 31500000,
      projected_year1_ebitda: 3980000,
      projected_margin_pct: 12.6,
      estimated_capex: 3000000,
      breakeven_months: 12,
      cannibalization_risk: 'Low (< 2.5% overlap; 22 km distance from George Town)',
      strategic_rationale: 'OMR represents Chennai\'s fastest-growing suburban corridor with high repeat daily grocery basket frequency.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'George Town wholesale district hypermarket operating at deficit due to shifting consumer residential migration southward.',
      lease_savings_annual: 1980000,
      staff_redeployment_plan: 'Redeploy staff to OMR IT Corridor supermarket.',
      inventory_transfer_plan: 'Rebalance high-margin FMCG into STR-TAMI-600001-M.'
    }
  },
  'West Bengal': {
    city_name: 'Kolkata Metro',
    primary_hub: 'BBD Bagh / Central (PIN 700001)',
    expansion_recommendation: {
      target_location: 'New Town / Rajarhat (Action Area I / City Centre II Catchment)',
      alternative_location: 'EM Bypass / Ruby Hospital Crossing',
      recommended_format: 'Modern Community Supermarket (4,200 sq ft)',
      target_demographic: 'High-density modern planned township residents with high packaged foods and personal care spending',
      projected_year1_revenue: 29500000,
      projected_year1_ebitda: 3650000,
      projected_margin_pct: 12.4,
      estimated_capex: 2800000,
      breakeven_months: 14,
      cannibalization_risk: 'Negligible (< 1.8% overlap; 15 km distance)',
      strategic_rationale: 'New Town offers master-planned residential footfall with modern retail infrastructure and low lease rates.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'Old central commercial district store operating at EBITDA deficit due to office-hours-only footfall.',
      lease_savings_annual: 1800000,
      staff_redeployment_plan: 'Redeploy staff to New Town supermarket.',
      inventory_transfer_plan: 'Transfer inventory to STR-WEST-700001-M supermarket.'
    }
  },
  'Gujarat': {
    city_name: 'Ahmedabad Metro',
    primary_hub: 'Bhadra / Central (PIN 380001)',
    expansion_recommendation: {
      target_location: 'SG Highway / Bodakdev (Judges Bungalow Road)',
      alternative_location: 'Prahlad Nagar Corporate Road',
      recommended_format: 'Gourmet FMCG Supermarket (5,000 sq ft)',
      target_demographic: 'Affluent business families with high demand for premium packaged staples, dry fruits, and branded foods',
      projected_year1_revenue: 33000000,
      projected_year1_ebitda: 4400000,
      projected_margin_pct: 13.3,
      estimated_capex: 3100000,
      breakeven_months: 12,
      cannibalization_risk: 'Low (< 2.2% overlap; 12 km distance from Old City)',
      strategic_rationale: 'SG Highway is Ahmedabad\'s prime modern retail corridor with highest purchasing power per household.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'Old city hypermarket operating at deficit due to traffic congestion and lack of customer parking.',
      lease_savings_annual: 1850000,
      staff_redeployment_plan: 'Transfer team to SG Highway gourmet store.',
      inventory_transfer_plan: 'Liquidate bulky lines and transfer FMCG to STR-GUJA-380001-M.'
    }
  },
  'Rajasthan': {
    city_name: 'Jaipur Capital Region',
    primary_hub: 'M.I. Road / Central (PIN 302001)',
    expansion_recommendation: {
      target_location: 'Vaishali Nagar (Amrapali Circle Catchment)',
      alternative_location: 'Mansarovar (VT Road Commercial Zone)',
      recommended_format: 'Family Mart Supermarket (4,400 sq ft)',
      target_demographic: 'Densely populated residential neighborhood with high family monthly grocery spending',
      projected_year1_revenue: 28000000,
      projected_year1_ebitda: 3520000,
      projected_margin_pct: 12.6,
      estimated_capex: 2700000,
      breakeven_months: 13,
      cannibalization_risk: 'Low (< 2.4% overlap; 10 km distance)',
      strategic_rationale: 'Vaishali Nagar is Jaipur\'s most vibrant residential zone with strong demand for organized retail.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'M.I. Road commercial showroom suffering deficit due to high commercial lease vs sluggish walk-ins.',
      lease_savings_annual: 1750000,
      staff_redeployment_plan: 'Redeploy associates to Vaishali Nagar family mart.',
      inventory_transfer_plan: 'Consolidate stock into STR-RAJA-302001-M.'
    }
  },
  'Punjab': {
    city_name: 'Chandigarh Tri-City',
    primary_hub: 'Sector 17 Commercial (PIN 160001)',
    expansion_recommendation: {
      target_location: 'Mohali Sector 82 (Aerocity Corridor)',
      alternative_location: 'Zirakpur VIP Road',
      recommended_format: 'Express Fresh & Grocery Supermarket (4,600 sq ft)',
      target_demographic: 'High-income tri-city suburbanites seeking modern drive-in retail and premium dairy/bakery products',
      projected_year1_revenue: 31000000,
      projected_year1_ebitda: 4050000,
      projected_margin_pct: 13.1,
      estimated_capex: 2950000,
      breakeven_months: 12,
      cannibalization_risk: 'Low (< 2.0% overlap; 14 km distance from Sector 17)',
      strategic_rationale: 'Mohali Aerocity is experiencing explosive residential development with zero organized modern trade competition.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'Sector 17 hypermarket operating at deficit with declining high-street shopping footfall.',
      lease_savings_annual: 1820000,
      staff_redeployment_plan: 'Transfer associates to Mohali Sector 82 store.',
      inventory_transfer_plan: 'Consolidate inventory into STR-PUNJ-160001-M supermarket.'
    }
  },
  'Uttar Pradesh': {
    city_name: 'Lucknow Metro',
    primary_hub: 'Hazratganj Central (PIN 226001)',
    expansion_recommendation: {
      target_location: 'Gomti Nagar Extension (Shaheed Path Corridor)',
      alternative_location: 'Aliganj Main Commercial Road',
      recommended_format: 'Community Grocery Supermarket (4,500 sq ft)',
      target_demographic: 'Expanding residential high-rise communities with high disposable income and organized retail preference',
      projected_year1_revenue: 29000000,
      projected_year1_ebitda: 3700000,
      projected_margin_pct: 12.8,
      estimated_capex: 2800000,
      breakeven_months: 13,
      cannibalization_risk: 'Low (< 2.1% overlap; 11 km distance from Hazratganj)',
      strategic_rationale: 'Gomti Nagar Extension has 12,000+ new apartments delivering within 18 months, guaranteeing early mover advantage.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'Hazratganj heritage zone hypermarket running loss due to heritage lease premiums and restricted delivery access.',
      lease_savings_annual: 1800000,
      staff_redeployment_plan: 'Redeploy associates to Gomti Nagar Extension supermarket.',
      inventory_transfer_plan: 'Consolidate into STR-UTTA-226001-M supermarket.'
    }
  },
  'Madhya Pradesh': {
    city_name: 'Bhopal Capital Region',
    primary_hub: 'MP Nagar / City Center (PIN 462001)',
    expansion_recommendation: {
      target_location: 'Kolar Road (Chuna Bhatti Residential Catchment)',
      alternative_location: 'Arera Colony E-8 Extension',
      recommended_format: 'Neighborhood Fresh Supermarket (4,200 sq ft)',
      target_demographic: 'Established residential families seeking daily fresh milk, produce, and packaged FMCG staples',
      projected_year1_revenue: 27500000,
      projected_year1_ebitda: 3480000,
      projected_margin_pct: 12.7,
      estimated_capex: 2650000,
      breakeven_months: 14,
      cannibalization_risk: 'Low (< 2.3% overlap; 9 km distance from MP Nagar)',
      strategic_rationale: 'Kolar Road provides strong residential density with high repeat purchase frequency and low commercial rentals.'
    },
    closure_rationale: {
      default_candidate_type: 'Large',
      closure_trigger: 'MP Nagar commercial hypermarket operating at deficit due to high commercial utility costs and low basket size.',
      lease_savings_annual: 1750000,
      staff_redeployment_plan: 'Transfer associates to Kolar Road neighborhood store.',
      inventory_transfer_plan: 'Consolidate into STR-MADH-462001-M supermarket.'
    }
  }
};

class StorePathwayService {
  /**
   * Helper to format currency values safely
   */
  formatNum(num) {
    return Number((Number(num) || 0).toFixed(2));
  }

  /**
   * Generate 5-year pathway roadmap and financial trajectory for a specific store,
   * incorporating the store's ACTUAL category performance, discount leakage, and format.
   */
  generatePathwayForStore(store, baselineMetrics, levers = {}, categoryInsights = null) {
    const {
      discountReduction = 0,
      assortmentShift = 0,
      opexSavings = 0
    } = levers;

    const baseRev = baselineMetrics.annual_revenue;
    const baseMarginPct = baselineMetrics.gross_margin_pct;
    const baseDiscountPct = baselineMetrics.avg_discount_pct;
    const baseOpex = baselineMetrics.annual_opex;
    const baseNetProfit = baselineMetrics.annual_net_profit;

    // 5-Year Trajectory Parameters
    // Year 1 (2026): Markdown Rationalization
    const y1DiscountCut = 5.5 + discountReduction;
    const y1MarginLift = (y1DiscountCut * 0.42);
    const y1RevGrowth = 1.04;
    const y1Rev = baseRev * y1RevGrowth;
    const y1MarginPct = baseMarginPct + y1MarginLift;
    const y1GrossProfit = y1Rev * (y1MarginPct / 100);
    const y1Opex = baseOpex * (1.02 - (opexSavings * 0.005));
    const y1NetProfit = y1GrossProfit - y1Opex;

    // Year 2 (2027): High-Margin Assortment Mix
    const y2AssortmentBoost = 2.4 + (assortmentShift * 0.3);
    const y2RevGrowth = 1.07;
    const y2Rev = y1Rev * y2RevGrowth;
    const y2MarginPct = y1MarginPct + y2AssortmentBoost;
    const y2GrossProfit = y2Rev * (y2MarginPct / 100);
    const y2Opex = y1Opex * (1.025 - (opexSavings * 0.01));
    const y2NetProfit = y2GrossProfit - y2Opex;

    // Year 3 (2028): Inventory Velocity & Supply Chain
    const y3RevGrowth = 1.08;
    const y3Rev = y2Rev * y3RevGrowth;
    const y3MarginPct = y2MarginPct + 1.2;
    const y3GrossProfit = y3Rev * (y3MarginPct / 100);
    const y3Opex = y2Opex * (0.97 - (opexSavings * 0.01));
    const y3NetProfit = y3GrossProfit - y3Opex;

    // Year 4 (2029): Omni-Channel & Digital Footfall Loyalty
    const y4RevGrowth = 1.09;
    const y4Rev = y3Rev * y4RevGrowth;
    const y4MarginPct = y3MarginPct + 0.8;
    const y4GrossProfit = y4Rev * (y4MarginPct / 100);
    const y4Opex = y3Opex * (1.02 - (opexSavings * 0.005));
    const y4NetProfit = y4GrossProfit - y4Opex;

    // Year 5 (2030): Automation & Fixed OpEx Optimization
    const y5RevGrowth = 1.06;
    const y5Rev = y4Rev * y5RevGrowth;
    const y5MarginPct = y4MarginPct + 0.5;
    const y5GrossProfit = y5Rev * (y5MarginPct / 100);
    const y5Opex = y4Opex * (0.93 - (opexSavings * 0.015));
    const y5NetProfit = y5GrossProfit - y5Opex;

    const trajectory = [
      {
        year: 2026,
        phase: 'Year 1: Markdown Rationalization',
        revenue: this.formatNum(y1Rev),
        gross_profit: this.formatNum(y1GrossProfit),
        opex: this.formatNum(y1Opex),
        net_profit: this.formatNum(y1NetProfit),
        profit_margin: this.formatNum((y1NetProfit / y1Rev) * 100),
        discount_rate: this.formatNum(Math.max(10, baseDiscountPct - y1DiscountCut)),
        key_lever: 'Cap clearance markdowns to 18%, curb promo cannibalization'
      },
      {
        year: 2027,
        phase: 'Year 2: Assortment Mix Optimization',
        revenue: this.formatNum(y2Rev),
        gross_profit: this.formatNum(y2GrossProfit),
        opex: this.formatNum(y2Opex),
        net_profit: this.formatNum(y2NetProfit),
        profit_margin: this.formatNum((y2NetProfit / y2Rev) * 100),
        discount_rate: this.formatNum(Math.max(10, baseDiscountPct - y1DiscountCut - 1.5)),
        key_lever: 'Reallocate 15% shelf-space to high-margin private label'
      },
      {
        year: 2028,
        phase: 'Year 3: Supply Chain & JIT Inventory',
        revenue: this.formatNum(y3Rev),
        gross_profit: this.formatNum(y3GrossProfit),
        opex: this.formatNum(y3Opex),
        net_profit: this.formatNum(y3NetProfit),
        profit_margin: this.formatNum((y3NetProfit / y3Rev) * 100),
        discount_rate: this.formatNum(Math.max(10, baseDiscountPct - y1DiscountCut - 2.5)),
        key_lever: 'Increase inventory turns to 6.5x, slash stockout carrying costs by 15%'
      },
      {
        year: 2029,
        phase: 'Year 4: Omni-Channel & Loyalty',
        revenue: this.formatNum(y4Rev),
        gross_profit: this.formatNum(y4GrossProfit),
        opex: this.formatNum(y4Opex),
        net_profit: this.formatNum(y4NetProfit),
        profit_margin: this.formatNum((y4NetProfit / y4Rev) * 100),
        discount_rate: this.formatNum(Math.max(10, baseDiscountPct - y1DiscountCut - 3.0)),
        key_lever: 'Launch click-and-collect, boost repeat customer frequency by 25%'
      },
      {
        year: 2030,
        phase: 'Year 5: Automated Operations & Energy',
        revenue: this.formatNum(y5Rev),
        gross_profit: this.formatNum(y5GrossProfit),
        opex: this.formatNum(y5Opex),
        net_profit: this.formatNum(y5NetProfit),
        profit_margin: this.formatNum((y5NetProfit / y5Rev) * 100),
        discount_rate: this.formatNum(Math.max(10, baseDiscountPct - y1DiscountCut - 3.5)),
        key_lever: 'Self-checkout kiosks, predictive workforce shifts, smart HVAC energy caps'
      }
    ];

    const total5YearProfitGain = y5NetProfit - baseNetProfit;
    const profitMultiplier = baseNetProfit > 0 
      ? (y5NetProfit / baseNetProfit).toFixed(2) 
      : 'N/A (Turnaround)';

    const sqft = store.outlet_type === 'Large' ? 12000 : store.outlet_type === 'Medium' ? 6500 : 3200;
    const baseTxns = Math.max(1, baselineMetrics.annual_transactions);
    const baseSalesPerSqft = Math.round(baseRev / sqft);
    const targetSalesPerSqft = Math.round(y5Rev / sqft);
    const currentATV = Math.round(baseRev / baseTxns);

    // Extract store-specific category analytics
    const topCatName = categoryInsights?.top_category?.category_name || 'High-Velocity Packaged Foods';
    const topCatSales = categoryInsights?.top_category?.sales 
      ? `₹${((categoryInsights.top_category.sales / 5) / 100000).toFixed(1)}L` 
      : '₹28.5L';
    const worstCatName = categoryInsights?.worst_category?.category_name || 'Slow-Moving Bulk Goods';
    const worstCatSales = categoryInsights?.worst_category?.sales 
      ? `₹${((categoryInsights.worst_category.sales / 5) / 100000).toFixed(1)}L` 
      : '₹14.2L';
    const worstCatDiscount = categoryInsights?.worst_category?.discount 
      ? `${categoryInsights.worst_category.discount.toFixed(1)}%` 
      : '26.0%';

    // Format-specific physical layout actions
    const layoutByFormat = {
      Small: {
        y1: 'Decommission bulky rear display shelving; install compact 3-tier chilled grab-and-go showcase at entrance.',
        y2: 'Compress billing counter into dual express mini-POS stations to widen main customer aisleway from 3.2 ft to 4.8 ft.',
        y3: 'Mount high-density vertical hanging merchandise strips along perimeter walls for high-margin impulse accessories.',
        y4: 'Set up designated 120 sq ft Click-and-Collect express pickup locker beside store exit.',
        y5: 'Deploy 2 compact self-checkout tap-and-go kiosks, reallocating 1 cashier to active floor customer advisory.'
      },
      Medium: {
        y1: 'Reconfigure center grocery gondolas from tight parallel rows into angled chevron layout to optimize customer foot-traffic flow.',
        y2: 'Expand chilled dairy and beverage section from 2 to 4 refrigerated display doors with glass-door energy covers.',
        y3: 'Carve out 450 sq ft backroom staging hub for 15-minute Click-and-Collect digital customer order packing.',
        y4: 'Reposition impulse snack towers and confectionery bins at checkout queue stanchions.',
        y5: 'Replace 2 legacy manned checkouts with 3 self-service touchpoints, expanding peak checkout throughput by 45%.'
      },
      Large: {
        y1: 'Downsize underperforming furniture and bulky appliance showroom by 1,800 sq ft, reclaiming prime footage for high-margin gourmet foods.',
        y2: 'Install high-margin private-label feature gondolas along main racetrack aisle with dedicated LED accent spotlights.',
        y3: 'Construct dedicated rear quick-commerce micro-fulfillment staging dock with separate courier dispatch door.',
        y4: 'Deploy dynamic Electronic Shelf Labels (ESL) across high-velocity FMCG aisles and promotional feature towers.',
        y5: 'Install 4 full self-checkout islands and IoT automated HVAC temperature zoning to cut hypermarket power consumption.'
      }
    };
    const formatLayout = layoutByFormat[store.outlet_type] || layoutByFormat.Medium;

    // Format-specific CapEx calibration
    const capexByFormat = {
      Small: ['₹2.8 Lakhs', '₹4.0 Lakhs', '₹4.5 Lakhs', '₹3.2 Lakhs', '₹5.5 Lakhs'],
      Medium: ['₹3.5 Lakhs', '₹5.0 Lakhs', '₹6.5 Lakhs', '₹4.0 Lakhs', '₹8.0 Lakhs'],
      Large: ['₹5.2 Lakhs', '₹7.5 Lakhs', '₹9.0 Lakhs', '₹6.0 Lakhs', '₹11.5 Lakhs']
    };
    const formatCapex = capexByFormat[store.outlet_type] || capexByFormat.Medium;

    // Detailed 5-Year Shop Operational Plans - DYNAMICALLY STORE & CATEGORY SPECIFIC
    const detailed_annual_plans = [
      {
        year: 2026,
        phase_title: 'Year 1 (2026): Emergency Markdown Freeze & Category Rationalization',
        theme: `Margin Protection & Space Reset for ${store.store_code}`,
        financial_targets: {
          revenue: this.formatNum(y1Rev),
          gross_profit: this.formatNum(y1GrossProfit),
          gross_margin_pct: this.formatNum(y1MarginPct),
          opex: this.formatNum(y1Opex),
          net_profit: this.formatNum(y1NetProfit),
          profit_margin: this.formatNum((y1NetProfit / y1Rev) * 100),
          sales_per_sqft: Math.round(y1Rev / sqft),
          atv_target: Math.round(currentATV * 1.05),
          max_discount_ceiling: '18.0%'
        },
        what_to_increase: [
          `Increase shelf-facing and stock depth for top-performing "${topCatName}" (historical sales: ${topCatSales}) by +25%.`,
          `Introduce 10-12 curated private-label staple SKUs in "${topCatName}" carrying 38%+ gross margins at high-visibility end-caps.`,
          `Increase Average Ticket Value (ATV) from current ₹${currentATV.toLocaleString('en-IN')} to target ₹${Math.round(currentATV * 1.05).toLocaleString('en-IN')} via checkout impulse merchandising.`,
          `Increase active inventory visibility on top 50 revenue-generating SKUs to eliminate recurring stockouts.`
        ],
        what_to_reduce: [
          `Slash floor display space and procurement orders for underperforming "${worstCatName}" (current sales: ${worstCatSales}, worst margin drag) by 45%.`,
          `Enforce a strict 18.0% POS discount freeze, halting unauthorized cashier overrides and curbing the store's baseline ${baseDiscountPct.toFixed(1)}% markdown leakage.`,
          `Eliminate margin-eroding buy-one-get-one promotions on low-margin branded goods; prune bottom 12% slow-moving SKUs.`,
          `Reduce stagnant dead inventory (>90 days old) by 60% via bundled liquidation without negative margin write-offs.`
        ],
        store_layout_changes: formatLayout.y1,
        pricing_markdown_plan: `Lock point-of-sale registers against price overrides above 18.0%. Specifically curb promo leakage in "${worstCatName}" where discounts averaged ${worstCatDiscount}.`,
        merchandising_plan: `Reclaim 20% floor footage from "${worstCatName}" to double facing for high-performing "${topCatName}". Stock 10 private-label lines.`,
        operations_labor_plan: `Restructure weekly associate staffing hours to strictly match footfall curves (peak 4 PM - 9 PM weekdays, 11 AM - 9 PM weekends), cutting 18 unneeded off-peak associate hours/week.`,
        capex_investment: `${formatCapex[0]} (POS firmware security lock, barcode audit scanners, modular merchandising signage)`,
        manager_deliverables: [
          `Audit and eliminate all cashier promotional overrides within the first 30 days of FY 2026`,
          `Rebalance inventory ratio: expand "${topCatName}" shelf share while cutting "${worstCatName}" floor stock by 45%`,
          `Achieve store-level breakeven EBITDA run-rate by end of Q3 2026`
        ]
      },
      {
        year: 2027,
        phase_title: 'Year 2 (2027): High-Margin Assortment Mix & Space Rationalization',
        theme: `Assortment Rebalancing & Basket Expansion in ${store.city_type} (${store.state})`,
        financial_targets: {
          revenue: this.formatNum(y2Rev),
          gross_profit: this.formatNum(y2GrossProfit),
          gross_margin_pct: this.formatNum(y2MarginPct),
          opex: this.formatNum(y2Opex),
          net_profit: this.formatNum(y2NetProfit),
          profit_margin: this.formatNum((y2NetProfit / y2Rev) * 100),
          sales_per_sqft: Math.round(y2Rev / sqft),
          atv_target: Math.round(currentATV * 1.11),
          max_discount_ceiling: '16.5%'
        },
        what_to_increase: [
          `Increase space productivity by reallocating 18% floor space to high-margin packaged snacks, wellness, and chilled dairy.`,
          `Increase private-label penetration to 22% of total store sales volume across "${topCatName}" and FMCG.`,
          `Increase customer repeat shopping frequency from 1.6 to 2.4 visits per month via neighborhood loyalty initiatives.`,
          `Increase Average Ticket Value (ATV) to ₹${Math.round(currentATV * 1.11).toLocaleString('en-IN')} through strategic multi-buy cross-merchandising.`
        ],
        what_to_reduce: [
          `Reduce stagnant aging inventory (>60 days) by an additional 70%, liberating working capital.`,
          `Reduce non-peak morning associate shift hours by 22-26 hours per week to match footfall curves.`,
          `Reduce promotional discount ceiling further to 16.5%, shifting to volume bundles rather than flat price discounts.`,
          `Reduce supplier delivery discrepancy disputes and damaged goods receipt below 0.35%.`
        ],
        store_layout_changes: formatLayout.y2,
        pricing_markdown_plan: 'Shift from broad percentage discounts to multi-buy bundling (e.g. "Buy 2 Get 25% Off complementary high-margin SKU") to expand Average Ticket Value.',
        merchandising_plan: `Expand private label to 22% of total store sales. Position high-margin impulse items directly adjacent to the checkout queue.`,
        operations_labor_plan: 'Train floor associates in cross-selling and product advisory. Cross-train cashiers during midday lulls for shelf facing and stock replenishment.',
        capex_investment: `${formatCapex[1]} (Premium modular gondola display units, LED aisle spotlights, digital promotional shelf talkers)`,
        manager_deliverables: [
          `Grow store Average Ticket Value (ATV) to ₹${Math.round(currentATV * 1.11).toLocaleString('en-IN')} (+${Math.round((currentATV * 1.11 - currentATV))} gain)`,
          `Private label categories generate at least 22% of store sales volume`,
          `Maintain store inventory breakage and shrink below 0.50% of turnover`
        ]
      },
      {
        year: 2028,
        phase_title: 'Year 3 (2028): Supply Chain Velocity & Just-In-Time Inventory',
        theme: `Inventory Carrying Cost Reduction & Stock Turns Expansion`,
        financial_targets: {
          revenue: this.formatNum(y3Rev),
          gross_profit: this.formatNum(y3GrossProfit),
          gross_margin_pct: this.formatNum(y3MarginPct),
          opex: this.formatNum(y3Opex),
          net_profit: this.formatNum(y3NetProfit),
          profit_margin: this.formatNum((y3NetProfit / y3Rev) * 100),
          sales_per_sqft: Math.round(y3Rev / sqft),
          atv_target: Math.round(currentATV * 1.18),
          max_discount_ceiling: '15.0%'
        },
        what_to_increase: [
          `Increase annual inventory stock turns from 3.8x to 6.5x via daily automated cross-dock replenishment.`,
          `Increase supplier direct-store-delivery (DSD) share for high-velocity perishable categories to 72%.`,
          `Increase sales associate customer-facing advisory time by 30% through automated RFID stock auditing.`,
          `Increase shelf availability on top 100 revenue items to 98.8%, virtually eliminating lost sales from stockouts.`
        ],
        what_to_reduce: [
          `Reduce store backroom storage footprint by 25-30%, converting reclaimed square footage into revenue-generating retail sales floor.`,
          `Reduce annual inventory holding and warehouse carrying costs by 15%.`,
          `Reduce markdown write-offs on expiring items by deploying algorithmic dynamic markdown triggers 7 days prior to shelf expiry.`,
          `Reduce manual clipboard stocktaking labor from 20 hours/week down to 4 hours/week.`
        ],
        store_layout_changes: formatLayout.y3,
        pricing_markdown_plan: 'Deploy dynamic algorithmic markdown triggers: mark down perishable goods automatically 7 days prior to expiry, preventing total write-offs.',
        merchandising_plan: 'Implement automated daily replenishment from regional fulfillment cross-dock. Reduce warehouse stock backlog.',
        operations_labor_plan: 'Transition to automated RFID handheld scanning, saving 16 hours of associate labor per week for active customer sales assistance.',
        capex_investment: `${formatCapex[2]} (RFID stock audit terminals, automated rolling pallet dollies, inventory tracking iPads)`,
        manager_deliverables: [
          `Reduce stockouts on Top-100 revenue-generating SKUs below 1.2%`,
          `Reclaim 25% backroom storage footage and convert to active front-end sales floor`,
          `Achieve 6.5x annual inventory stock turns across all store categories`
        ]
      },
      {
        year: 2029,
        phase_title: 'Year 4 (2029): Omni-Channel Footfall & Digital Loyalty Expansion',
        theme: `Customer Lifetime Value & Omni-Channel Frequency`,
        financial_targets: {
          revenue: this.formatNum(y4Rev),
          gross_profit: this.formatNum(y4GrossProfit),
          gross_margin_pct: this.formatNum(y4MarginPct),
          opex: this.formatNum(y4Opex),
          net_profit: this.formatNum(y4NetProfit),
          profit_margin: this.formatNum((y4NetProfit / y4Rev) * 100),
          sales_per_sqft: Math.round(y4Rev / sqft),
          atv_target: Math.round(currentATV * 1.24),
          max_discount_ceiling: '14.0%'
        },
        what_to_increase: [
          `Increase digital omnichannel Click-and-Collect fulfillment to generate 18-22% of total store revenue.`,
          `Increase enrolled loyalty club members to 68% of active customer transactions.`,
          `Increase repeat customer visit frequency from 1.8 to 3.2 visits per month via tailored digital app promotions.`,
          `Increase high-margin impulse grab-and-go purchases at checkout staging lanes.`
        ],
        what_to_reduce: [
          `Reduce printed paper promotional circulars and physical advertising spend by 75% in favor of targeted digital app push notifications.`,
          `Reduce register queuing wait times during peak evening hours (5 PM - 9 PM) to under 80 seconds.`,
          `Reduce public promotional discounts: general walk-in shoppers pay full shelf price, restricting member discounts to personalized app coupons.`,
          `Reduce product return and breakage rates below 0.40% of gross turnover.`
        ],
        store_layout_changes: formatLayout.y4,
        pricing_markdown_plan: 'Replace generic public discounts with app-based personalized loyalty coupons. General public pays full shelf price, protecting store gross margin.',
        merchandising_plan: 'Establish front-of-store Click-and-Collect rapid order staging hub. Curate high-margin impulse grab-and-go displays along the pickup pathway.',
        operations_labor_plan: 'Designate 2 cross-trained omni-channel fulfillment pickers during morning and evening rush hours. Guarantee under-15-minute order readiness.',
        capex_investment: `${formatCapex[3]} (Express click-and-collect customer counter, order notification screens, barcode staging bins)`,
        manager_deliverables: [
          `Digital Click-and-Collect orders contribute at least 18% of total store revenue`,
          `Customer repeat visit frequency increases from 1.8 to 3.2 visits per month`,
          `Enrolled active loyalty club members account for 68%+ of store transactions`
        ]
      },
      {
        year: 2030,
        phase_title: 'Year 5 (2030): Automated Operations & Peak Margin Realization',
        theme: `Sustainable Peak Retail Profitability & Smart Automation for ${store.store_code}`,
        financial_targets: {
          revenue: this.formatNum(y5Rev),
          gross_profit: this.formatNum(y5GrossProfit),
          gross_margin_pct: this.formatNum(y5MarginPct),
          opex: this.formatNum(y5Opex),
          net_profit: this.formatNum(y5NetProfit),
          profit_margin: this.formatNum((y5NetProfit / y5Rev) * 100),
          sales_per_sqft: targetSalesPerSqft,
          atv_target: Math.round(currentATV * 1.30),
          max_discount_ceiling: '13.0%'
        },
        what_to_increase: [
          `Increase terminal private-label share to 36% across all core grocery and household aisles.`,
          `Increase automated self-checkout transaction throughput to handle 60% of all small-basket transactions (under 8 items).`,
          `Achieve target annual EBITDA of ₹${(y5NetProfit / 100000).toFixed(1)} Lakh (${((y5NetProfit / y5Rev) * 100).toFixed(1)}% EBITDA margin).`,
          `Increase sales density to ₹${targetSalesPerSqft.toLocaleString('en-IN')}/sq ft (+₹${(targetSalesPerSqft - baseSalesPerSqft).toLocaleString('en-IN')}/sq ft increase over baseline).`
        ],
        what_to_reduce: [
          `Reduce store labor expense ratio below 9.2% of store revenue through self-checkout automation.`,
          `Reduce store electrical HVAC and lighting utility bills by 15% via smart building IoT sensors and automated off-peak temperature regulation.`,
          `Eliminate manual price tagging errors and audit delays completely through full Electronic Shelf Label (ESL) integration.`,
          `Cap overall store discount leakage strictly below 13.0%, preserving ₹${((y5Rev * 0.12) / 100000).toFixed(1)}L in gross profit pools.`
        ],
        store_layout_changes: formatLayout.y5,
        pricing_markdown_plan: 'AI dynamic shelf pricing via Electronic Shelf Labels (ESL). Automatically captures peak shopping hour margin premiums while maintaining price competitiveness.',
        merchandising_plan: 'Optimized space productivity: 35% private label (highest margin), 45% branded staples (high velocity), 20% premium impulse items.',
        operations_labor_plan: 'Self-checkout stations process 60% of small-basket transactions. AI demand-forecasting software automates staff shift planning with 95% accuracy against footfall trends.',
        capex_investment: `${formatCapex[4]} (Self-checkout stations, Electronic Shelf Labels across top aisles, smart HVAC building automation system)`,
        manager_deliverables: [
          `Achieve target annual EBITDA of ₹${(y5NetProfit / 100000).toFixed(1)} Lakh (${((y5NetProfit / y5Rev) * 100).toFixed(1)}% margin)`,
          `Store labor cost drops below 9.2% of store revenue through self-checkout automation`,
          `Total 5-year profit increase over baseline exceeds +₹${((y5NetProfit - baseNetProfit) / 100000).toFixed(1)} Lakh`
        ]
      }
    ];

    // Store-Specific Turnaround Diagnosis
    const isNegative = baseNetProfit < 0;
    const storeDiagnosis = {
      severity: isNegative ? 'CRITICAL TURNAROUND' : 'MARGIN ACCELERATION',
      primary_leak: baseDiscountPct > 22
        ? `Excessive promotional discounting (${baseDiscountPct.toFixed(1)}% vs 18% benchmark) draining estimated ₹${((baseRev * (baseDiscountPct - 18) / 100) / 100000).toFixed(1)}L annually from gross profit.`
        : `High store operating expenses (₹${(baseOpex / 100000).toFixed(1)}L) relative to gross profit pool. Requires higher sales density.`,
      format_characteristics: `${store.outlet_type} format (${sqft.toLocaleString()} sq ft) in ${store.city_type} (${store.state}, ${store.region} Region). Current sales density: ₹${baseSalesPerSqft}/sq ft. Target density: ₹${targetSalesPerSqft}/sq ft.`,
      category_focus: `Top Category: "${topCatName}" (${topCatSales} sales). Underperforming Category: "${worstCatName}" (${worstCatSales} sales, ${worstCatDiscount} discount).`,
      summary: isNegative
        ? `Store ${store.store_code} is currently operating at an annualized net loss of ₹${(Math.abs(baseNetProfit) / 100000).toFixed(1)} Lakh. The 5-year pathway enforces markdown discipline in Year 1, resets category assortment in Year 2, and automates store labor to generate ₹${(y5NetProfit / 100000).toFixed(1)} Lakh in positive annual EBITDA by 2030.`
        : `Store ${store.store_code} is profitable but underperforming its full potential. The 5-year roadmap expands EBITDA from ₹${(baseNetProfit / 100000).toFixed(1)}L to ₹${(y5NetProfit / 100000).toFixed(1)}L (+${((y5NetProfit - baseNetProfit) / 100000).toFixed(1)}L gain) by shifting 15% shelf space to private label and cutting inventory carrying costs.`
    };

    // Quarterly Implementation Checklist for Year 1 (Immediate Next Steps)
    const quarterly_checklist = [
      {
        quarter: 'Q1 (Jan - Mar 2026)',
        focus: 'Cashier Discount Freeze & POS Lock',
        tasks: [
          `Install POS firmware update locking price overrides above 18% across all registers`,
          `Train all ${store.store_code} cashiers and supervisors on markdown policy; halt promotional discounts on "${topCatName}" staples`,
          `Conduct physical stock count and identify all aged SKUs (>90 days old) in "${worstCatName}"`
        ],
        kpi_target: 'POS markdown rate drops below 19.5%'
      },
      {
        quarter: 'Q2 (Apr - Jun 2026)',
        focus: 'Dead-Stock Liquidation & SKU Pruning',
        tasks: [
          `Bundle slow-moving items in "${worstCatName}" with high-velocity staples to clear inventory without losses`,
          `Remove bottom 12% unprofitable SKUs from store re-order lists`,
          `Reclaim shelf footage to execute initial "${topCatName}" private-label end-cap rollout`
        ],
        kpi_target: 'Dead stock inventory reduced by 60%'
      },
      {
        quarter: 'Q3 (Jul - Sep 2026)',
        focus: 'Private-Label Assortment Phase 1 & Shift Optimization',
        tasks: [
          `Stock first wave of 10 high-margin private label lines (35%+ gross margin)`,
          `Adjust shift schedules to match footfall curves, cutting 18-22 unneeded associate hours/week`,
          `Install LED timer automation to reduce electrical utility spend by 8%`
        ],
        kpi_target: 'Store achieves positive operating EBITDA for the quarter'
      },
      {
        quarter: 'Q4 (Oct - Dec 2026)',
        focus: 'Holiday Season Margin Protection & Annual Review',
        tasks: [
          `Protect margins during festive sales: cap holiday promotions at 18.0%`,
          `Promote high-margin festive gift baskets and private-label bundles at checkout`,
          `Review Year-1 results with Regional Retail Director and lock Year-2 CapEx plan`
        ],
        kpi_target: 'Annual gross margin reaches target ' + y1MarginPct.toFixed(1) + '%'
      }
    ];

    const specificLoc = getSpecificLocation(store.store_code, store.state, store.outlet_type);

    return {
      store_id: store.id,
      store_code: store.store_code,
      state: store.state,
      region: store.region,
      outlet_type: store.outlet_type,
      city_type: store.city_type,
      locality: specificLoc.locality,
      address: specificLoc.address,
      landmark: specificLoc.landmark,
      manager_name: specificLoc.manager_name,
      contact_phone: specificLoc.contact_phone,
      operating_hours: specificLoc.operating_hours,
      trading_format: specificLoc.trading_format,
      category_insights: categoryInsights,
      store_diagnosis: storeDiagnosis,
      detailed_annual_plans,
      quarterly_checklist,
      baseline: {
        annual_revenue: this.formatNum(baseRev),
        gross_profit: this.formatNum(baselineMetrics.gross_profit),
        gross_margin_pct: this.formatNum(baseMarginPct),
        avg_discount_pct: this.formatNum(baseDiscountPct),
        annual_opex: this.formatNum(baseOpex),
        annual_net_profit: this.formatNum(baseNetProfit),
        net_margin_pct: this.formatNum((baseNetProfit / baseRev) * 100),
        annual_transactions: baselineMetrics.annual_transactions,
        avg_ticket_value: currentATV,
        estimated_sqft: sqft,
        sales_per_sqft: baseSalesPerSqft,
        staff_count: store.outlet_type === 'Large' ? 24 : store.outlet_type === 'Medium' ? 14 : 7
      },
      projected_2030: {
        revenue: this.formatNum(y5Rev),
        gross_profit: this.formatNum(y5GrossProfit),
        opex: this.formatNum(y5Opex),
        net_profit: this.formatNum(y5NetProfit),
        profit_margin: this.formatNum((y5NetProfit / y5Rev) * 100),
        sales_per_sqft: targetSalesPerSqft,
        profit_gain_vs_baseline: this.formatNum(total5YearProfitGain),
        profit_multiplier: profitMultiplier
      },
      strategic_pillars: [
        {
          pillar: 'Pillar 1: Markdown Optimization',
          target_year: 2026,
          action: `Cap promotional markdowns to 18.0%. Stop discount leakage on staple "${topCatName}" SKUs.`,
          financial_impact: `+₹${((y1GrossProfit - baselineMetrics.gross_profit) / 100000).toFixed(1)} Lakh annual profit recovery`,
          status: 'Immediate Priority'
        },
        {
          pillar: 'Pillar 2: Assortment & Space Mix',
          target_year: 2027,
          action: `Reallocate 18% shelf footage from "${worstCatName}" to private label and high-margin impulse items.`,
          financial_impact: `+${y2AssortmentBoost.toFixed(1)}% Gross Margin expansion`,
          status: 'Planned'
        },
        {
          pillar: 'Pillar 3: Just-In-Time Inventory',
          target_year: 2028,
          action: 'Implement predictive auto-replenishment. Reduce slow-moving buffer stock and carrying costs.',
          financial_impact: '15% reduction in store storage & carrying overhead',
          status: 'Planned'
        },
        {
          pillar: 'Pillar 4: Omni-Channel Footfall',
          target_year: 2029,
          action: 'Integrate click-and-collect with digital app orders. Elevate repeat customer frequency to 3.2 visits/month.',
          financial_impact: '+12% Average Ticket Value (ATV)',
          status: 'Planned'
        },
        {
          pillar: 'Pillar 5: Operational Automation',
          target_year: 2030,
          action: 'Deploy self-checkout stations, IoT energy sensors, and demand-forecast staffing scheduling.',
          financial_impact: 'Achieve 16-18% EBITDA margin benchmark',
          status: 'Long-term Goal'
        }
      ],
      trajectory,
      recommendation_badge: y5NetProfit > 2500000 ? 'STAR PERFORMER' : 'TURNAROUND CANDIDATE',
      execution_urgency: baseNetProfit < 0 ? 'CRITICAL TURNAROUND' : 'MARGIN EXPANSION'
    };
  }

  /**
   * Evaluates City Cluster Real Estate & Network Optimization Directives
   * Answers faculty requirement:
   * - Nationwide & Territory-level portfolio restructuring
   * - Aggregate sales across all shops in selected territory (or nationwide 30 outlets)
   * - Identify closure/consolidation candidates (e.g. stores with losses, zero sales, or high rent drag)
   * - Recommend new store expansion nearby in high-demand micro-markets
   * - Provide Network Synergy Simulator ("Before vs After Restructuring")
   */
  async getCityClusterAnalysis(organizationId, stateFilter = null, storePathwaysList = null) {
    const isNationwide = !stateFilter || stateFilter === '' || stateFilter.toLowerCase() === 'all';
    const selectedState = isNationwide ? 'ALL' : stateFilter;

    // Get stores in this state cluster or nationwide
    const clusterStores = isNationwide
      ? (storePathwaysList || [])
      : (storePathwaysList || []).filter(s => s.state.toLowerCase() === selectedState.toLowerCase());

    const clusterMeta = isNationwide
      ? {
          city_name: 'Nationwide Retail Network (10 Commercial Hubs)',
          primary_hub: 'All-India Multi-Territory Catchment (North, South, West, East)',
          expansion_recommendation: {
            target_location: 'Whitefield IT Corridor (Bengaluru) & Cyber City (Gurugram)',
            alternative_location: 'BKC Financial District (Mumbai) & OMR IT Expressway (Chennai)',
            recommended_format: 'Dual Expansion: Flagship Fresh Supermarket & High-Velocity Express Hub',
            target_demographic: 'High-density affluent tech professionals and residential families with premium weekly basket sizes',
            projected_year1_revenue: 38000000,
            projected_year1_ebitda: 4950000,
            projected_margin_pct: 13.0,
            estimated_capex: 3500000,
            breakeven_months: 12,
            cannibalization_risk: 'Zero (< 1.2% overlap with existing nationwide stores)',
            strategic_rationale: 'Strategic greenfield penetration in India’s top two fastest-growing tech micro-markets, capturing underserved premium grocery share.'
          },
          closure_rationale: {
            default_candidate_type: 'Large',
            closure_trigger: 'Nationwide worst-performing outlet running severe negative EBITDA deficit due to high commercial lease drag and sub-benchmark sales velocity.',
            lease_savings_annual: 2400000,
            staff_redeployment_plan: 'Redeploy associates across neighboring high-volume regional stores and new greenfield expansion sites.',
            inventory_transfer_plan: 'Consolidate slow inventory and redistribute fast-moving stock to regional sister stores.'
          }
        }
      : CITY_CLUSTER_METADATA[selectedState] || {
          city_name: `${selectedState} Commercial Region`,
          primary_hub: `${selectedState} Central Catchment`,
          expansion_recommendation: {
            target_location: `${selectedState} Suburban Growth Corridor`,
            alternative_location: `${selectedState} Ring Road Commercial Center`,
            recommended_format: 'Compact Fresh Supermarket (4,500 sq ft)',
            target_demographic: 'High-density residential catchment with strong weekly grocery basket demand',
            projected_year1_revenue: 30000000,
            projected_year1_ebitda: 3800000,
            projected_margin_pct: 12.6,
            estimated_capex: 2900000,
            breakeven_months: 13,
            cannibalization_risk: 'Low (< 2.5% overlap)',
            strategic_rationale: 'Capture underserved family grocery demand in newly urbanized residential belt.'
          },
          closure_rationale: {
            default_candidate_type: 'Large',
            closure_trigger: 'High fixed occupancy cost relative to sales density causing EBITDA margin compression.',
            lease_savings_annual: 1800000,
            staff_redeployment_plan: 'Redeploy staff to cluster supermarket and new expansion location.',
            inventory_transfer_plan: 'Transfer fast-moving stock to sister store in the cluster.'
          }
        };

    // Calculate current cluster aggregate performance
    const currentRev = clusterStores.reduce((sum, s) => sum + s.baseline.annual_revenue, 0) || 50000000;
    const currentGross = clusterStores.reduce((sum, s) => sum + s.baseline.gross_profit, 0) || 7500000;
    const currentOpex = clusterStores.reduce((sum, s) => sum + s.baseline.annual_opex, 0) || 4500000;
    const currentNet = currentGross - currentOpex;
    const currentTotalSqft = clusterStores.reduce((sum, s) => sum + s.baseline.estimated_sqft, 0) || (isNationwide ? 217000 : 21700);
    const currentSalesDensity = Math.round(currentRev / Math.max(1, currentTotalSqft));

    // Identify the prime candidate for closure / consolidation
    // Priority:
    // 1. Any store with 0 or near-zero sales
    // 2. The most loss-making store (lowest net profit)
    // 3. The store with the lowest sales density
    let closureCandidate = null;
    if (clusterStores.length > 0) {
      // Sort to find the weakest store
      const sortedByDeficit = [...clusterStores].sort((a, b) => {
        // Zero sales comes first
        if (a.baseline.annual_revenue === 0 && b.baseline.annual_revenue > 0) return -1;
        if (b.baseline.annual_revenue === 0 && a.baseline.annual_revenue > 0) return 1;
        // Lowest net profit (most negative) comes next
        return a.baseline.annual_net_profit - b.baseline.annual_net_profit;
      });

      closureCandidate = sortedByDeficit[0];
    }

    const closureStoreCode = closureCandidate ? closureCandidate.store_code : `STR-${selectedState.substring(0,4).toUpperCase()}-110001-S`;
    const closureStoreRev = closureCandidate ? closureCandidate.baseline.annual_revenue : 16500000;
    const closureStoreOpex = closureCandidate ? closureCandidate.baseline.annual_opex : 3375000;
    const closureStoreProfit = closureCandidate ? closureCandidate.baseline.annual_net_profit : -900000;
    const closureStoreSqft = closureCandidate ? closureCandidate.baseline.estimated_sqft : 12000;

    const hasZeroSales = closureCandidate && closureCandidate.baseline.annual_revenue <= 0;
    const closureRationaleText = hasZeroSales
      ? `CRITICAL ZERO-SALES ALERT: Store ${closureStoreCode} (${closureCandidate ? closureCandidate.state : 'Unknown'}) is registering ₹0 in customer sales revenue while incurring ₹${(closureStoreOpex / 100000).toFixed(1)} Lakhs annually in fixed commercial lease and utility overhead. Immediate lease exit and shuttering mandated to stop unrecoverable capital drain.`
      : isNationwide
        ? `NATIONWIDE PORTFOLIO DIRECTIVE: Store ${closureStoreCode} in ${closureCandidate ? `${closureCandidate.state} (${closureCandidate.outlet_type} format)` : 'the network'} has the chain's deepest operating deficit (EBITDA: -₹${Math.abs(closureStoreProfit / 100000).toFixed(2)} Lakhs) and lowest space productivity (₹${Math.round(closureStoreRev / Math.max(1, closureStoreSqft))}/sq ft). Terminating this lease liberates ₹${((clusterMeta.closure_rationale.lease_savings_annual || Math.round(closureStoreOpex * 0.55)) / 100000).toFixed(1)} Lakhs in annual fixed occupancy costs and redeploys capital to high-growth expansion corridors.`
        : clusterMeta.closure_rationale.closure_trigger;

    const leaseSavings = clusterMeta.closure_rationale.lease_savings_annual || Math.round(closureStoreOpex * 0.55);

    // Expansion numbers
    const expRev = clusterMeta.expansion_recommendation.projected_year1_revenue;
    const expEbitda = clusterMeta.expansion_recommendation.projected_year1_ebitda;
    const expSqft = 4500;
    const expOpex = Math.round(expRev * 0.12);

    // Network Restructuring Simulation (Before vs After)
    // After: Close candidate store + Launch recommended expansion store
    const restructuredRev = currentRev - closureStoreRev + expRev;
    const restructuredOpex = currentOpex - closureStoreOpex + expOpex;
    const restructuredEbitda = currentNet - closureStoreProfit + expEbitda;
    const restructuredTotalSqft = currentTotalSqft - closureStoreSqft + expSqft;
    const restructuredSalesDensity = Math.round(restructuredRev / Math.max(1, restructuredTotalSqft));

    const ebitdaGain = restructuredEbitda - currentNet;
    const revGrowthPct = ((restructuredRev - currentRev) / Math.max(1, currentRev)) * 100;
    const densityGain = restructuredSalesDensity - currentSalesDensity;

    // Build all clusters overview list for quick switching
    const allStates = Object.keys(CITY_CLUSTER_METADATA);
    const allClustersSummary = allStates.map(st => {
      const stores = (storePathwaysList || []).filter(s => s.state.toLowerCase() === st.toLowerCase());
      const rev = stores.reduce((sum, s) => sum + s.baseline.annual_revenue, 0);
      const profit = stores.reduce((sum, s) => sum + s.baseline.annual_net_profit, 0);
      return {
        state: st,
        city_name: CITY_CLUSTER_METADATA[st].city_name,
        stores_count: stores.length,
        annual_revenue: this.formatNum(rev),
        annual_profit: this.formatNum(profit),
        expansion_target: CITY_CLUSTER_METADATA[st].expansion_recommendation.target_location
      };
    });

    return {
      selected_state: selectedState,
      is_nationwide: isNationwide,
      city_meta: clusterMeta,
      cluster_summary: {
        stores_count: clusterStores.length,
        total_revenue: this.formatNum(currentRev),
        total_gross_profit: this.formatNum(currentGross),
        gross_margin_pct: this.formatNum((currentGross / Math.max(1, currentRev)) * 100),
        total_opex: this.formatNum(currentOpex),
        net_profit: this.formatNum(currentNet),
        net_margin_pct: this.formatNum((currentNet / Math.max(1, currentRev)) * 100),
        total_retail_sqft: currentTotalSqft,
        sales_density_per_sqft: currentSalesDensity
      },
      closure_directive: {
        directive_badge: isNationwide ? 'NATIONWIDE STRATEGIC DIRECTIVE: CHAIN-WIDE CLOSURE CANDIDATE' : 'STRATEGIC DIRECTIVE: STORE CONSOLIDATION / CLOSURE',
        target_store_code: closureStoreCode,
        outlet_type: closureCandidate ? closureCandidate.outlet_type : 'Small',
        current_annual_revenue: this.formatNum(closureStoreRev),
        current_annual_opex: this.formatNum(closureStoreOpex),
        current_net_profit: this.formatNum(closureStoreProfit),
        current_sales_density: Math.round(closureStoreRev / Math.max(1, closureStoreSqft)),
        commercial_rationale: closureRationaleText,
        annual_lease_savings: this.formatNum(leaseSavings),
        staff_redeployment_plan: clusterMeta.closure_rationale.staff_redeployment_plan,
        inventory_transfer_plan: clusterMeta.closure_rationale.inventory_transfer_plan,
        exit_timeline: '90-Day Lease Exit Notice (Zero Severance Liability)'
      },
      expansion_directive: {
        directive_badge: isNationwide ? 'NATIONWIDE EXPANSION DIRECTIVE: TOP GREENFIELD EXPANSION' : 'COMMERCIAL EXPANSION DIRECTIVE: RECOMMENDED NEW STORE SITE',
        target_location: clusterMeta.expansion_recommendation.target_location,
        alternative_location: clusterMeta.expansion_recommendation.alternative_location,
        recommended_format: clusterMeta.expansion_recommendation.recommended_format,
        target_demographic: clusterMeta.expansion_recommendation.target_demographic,
        projected_year1_revenue: this.formatNum(expRev),
        projected_year1_ebitda: this.formatNum(expEbitda),
        projected_margin_pct: clusterMeta.expansion_recommendation.projected_margin_pct,
        estimated_capex: this.formatNum(clusterMeta.expansion_recommendation.estimated_capex),
        breakeven_months: clusterMeta.expansion_recommendation.breakeven_months,
        cannibalization_risk: clusterMeta.expansion_recommendation.cannibalization_risk,
        strategic_rationale: clusterMeta.expansion_recommendation.strategic_rationale
      },
      network_synergy_simulation: {
        current: {
          stores_count: clusterStores.length,
          revenue: this.formatNum(currentRev),
          opex: this.formatNum(currentOpex),
          ebitda: this.formatNum(currentNet),
          ebitda_margin: this.formatNum((currentNet / Math.max(1, currentRev)) * 100),
          sales_density: currentSalesDensity
        },
        restructured: {
          stores_count: clusterStores.length, // closed 1 + opened 1
          revenue: this.formatNum(restructuredRev),
          opex: this.formatNum(restructuredOpex),
          ebitda: this.formatNum(restructuredEbitda),
          ebitda_margin: this.formatNum((restructuredEbitda / Math.max(1, restructuredRev)) * 100),
          sales_density: restructuredSalesDensity
        },
        impact: {
          revenue_gain: this.formatNum(restructuredRev - currentRev),
          revenue_growth_pct: this.formatNum(revGrowthPct),
          ebitda_gain: this.formatNum(ebitdaGain),
          margin_expansion_bps: Math.round(((restructuredEbitda / restructuredRev) - (currentNet / currentRev)) * 10000),
          sales_density_gain: densityGain,
          strategic_status: isNationwide ? 'CHAIN-WIDE NETWORK REBALANCED: UNPROFITABLE FOOTPRINT ELIMINATED' : 'TRANSFORMED FROM MARGIN DRAG TO TOP REGIONAL PROFIT ENGINE'
        }
      },
      all_clusters_summary: allClustersSummary
    };
  }

  /**
   * Fetch all stores and calculate 5-year profit pathways for all,
   * enriched with category sales rankings and city cluster real estate analysis.
   */
  async getAllStorePathways(organizationId, filters = {}, levers = {}) {
    const STATE_TO_REGION = {
      'Delhi': 'North',
      'Punjab': 'North',
      'Uttar Pradesh': 'North',
      'Maharashtra': 'West',
      'Gujarat': 'West',
      'Rajasthan': 'West',
      'Karnataka': 'South',
      'Tamil Nadu': 'South',
      'West Bengal': 'East',
      'Madhya Pradesh': 'East'
    };

    let filterState = filters.state;
    let filterRegion = filters.region;

    // Defend against contradictory filters (e.g. state='Maharashtra' and region='North'):
    // If state and region don't match, drop the state filter so the selected region query succeeds
    if (filterState && filterRegion && STATE_TO_REGION[filterState] && STATE_TO_REGION[filterState] !== filterRegion) {
      filterState = null;
    }

    const storesQuery = db('stores').where({ organization_id: organizationId });
    if (filterRegion) storesQuery.andWhere({ region: filterRegion });
    if (filters.outlet_type) storesQuery.andWhere({ outlet_type: filters.outlet_type });
    if (filterState) storesQuery.andWhere({ state: filterState });

    const stores = await storesQuery.orderBy('store_code', 'asc');

    // Aggregate store-level sales from 5-year dataset and annualize (divide by 5)
    const storeSalesRes = await db('sales')
      .where({ organization_id: organizationId })
      .groupBy('store_id')
      .select('store_id')
      .sum({ total_sales: 'sales_amount' })
      .sum({ total_profit: 'profit_amount' })
      .avg({ avg_discount: 'discount' })
      .count({ total_txns: 'id' });

    const salesMap = {};
    storeSalesRes.forEach(s => {
      salesMap[s.store_id] = {
        annual_revenue: (Number(s.total_sales) || 84000000) / 5,
        gross_profit: (Number(s.total_profit) || 12600000) / 5,
        gross_margin_pct: Number(s.total_sales) > 0 ? (Number(s.total_profit) / Number(s.total_sales)) * 100 : 15.0,
        avg_discount_pct: (Number(s.avg_discount) || 0.25) * 100,
        annual_transactions: Math.round((Number(s.total_txns) || 3300) / 5)
      };
    });

    // Query category sales breakdown for each store to find top and worst categories
    const storeCatRes = await db('sales')
      .join('products', 'sales.product_id', 'products.id')
      .join('categories', 'products.category_id', 'categories.id')
      .join('stores', 'sales.store_id', 'stores.id')
      .where({ 'stores.organization_id': organizationId })
      .groupBy('stores.id', 'categories.category_name')
      .select('stores.id as store_id', 'categories.category_name')
      .sum({ sales: 'sales.sales_amount' })
      .sum({ profit: 'sales.profit_amount' })
      .avg({ discount: 'sales.discount' });

    const storeCategoryMap = {};
    storeCatRes.forEach(r => {
      if (!storeCategoryMap[r.store_id]) storeCategoryMap[r.store_id] = [];
      storeCategoryMap[r.store_id].push({
        category_name: r.category_name,
        sales: Number(r.sales) || 0,
        profit: Number(r.profit) || 0,
        discount: (Number(r.discount) || 0) * 100,
        margin_pct: Number(r.sales) > 0 ? (Number(r.profit) / Number(r.sales)) * 100 : 0
      });
    });

    // OpEx allocation based on outlet size
    const opexMultipliers = {
      Small: 11500000,
      Medium: 16500000,
      Large: 22500000
    };

    const storePathways = stores.map(store => {
      const salesData = salesMap[store.id] || {
        annual_revenue: 16800000,
        gross_profit: 2520000,
        gross_margin_pct: 15.0,
        avg_discount_pct: 25.0,
        annual_transactions: 660
      };

      // Base OpEx is calibrated to store format scale (Large: ~₹33.75L fixed occupancy, Medium: ~₹24.75L, Small: ~₹17.25L)
      const annualOpex = opexMultipliers[store.outlet_type] 
        ? opexMultipliers[store.outlet_type] * 0.15
        : salesData.annual_revenue * 0.12;

      const annualNetProfit = salesData.gross_profit - annualOpex;

      const baselineMetrics = {
        ...salesData,
        annual_opex: annualOpex,
        annual_net_profit: annualNetProfit
      };

      // Determine top and worst categories for this specific store
      const cats = storeCategoryMap[store.id] || [];
      const sortedBySales = [...cats].sort((a, b) => b.sales - a.sales);
      const sortedByMargin = [...cats].sort((a, b) => a.margin_pct - b.margin_pct);

      const categoryInsights = {
        top_category: sortedBySales[0] || { category_name: 'Packaged Foods', sales: 2500000, profit: 375000, discount: 22 },
        worst_category: sortedByMargin[0] || sortedBySales[sortedBySales.length - 1] || { category_name: 'Slow Merchandise', sales: 1200000, profit: 150000, discount: 27 },
        all_categories: cats
      };

      return this.generatePathwayForStore(store, baselineMetrics, levers, categoryInsights);
    });

    // Summary calculation across all returned stores
    const totalBaselineRev = storePathways.reduce((sum, s) => sum + s.baseline.annual_revenue, 0);
    const totalBaselineProfit = storePathways.reduce((sum, s) => sum + s.baseline.annual_net_profit, 0);
    const total2030Rev = storePathways.reduce((sum, s) => sum + s.projected_2030.revenue, 0);
    const total2030Profit = storePathways.reduce((sum, s) => sum + s.projected_2030.net_profit, 0);
    const totalProfitUpside = total2030Profit - totalBaselineProfit;

    // Chain 5-Year Aggregated Trajectory
    const chainTrajectory = [2026, 2027, 2028, 2029, 2030].map(yr => {
      const yearPoints = storePathways.map(s => s.trajectory.find(t => t.year === yr));
      const yrRev = yearPoints.reduce((sum, p) => sum + (p?.revenue || 0), 0);
      const yrGross = yearPoints.reduce((sum, p) => sum + (p?.gross_profit || 0), 0);
      const yrOpex = yearPoints.reduce((sum, p) => sum + (p?.opex || 0), 0);
      const yrNet = yrGross - yrOpex;
      return {
        year: yr,
        total_revenue: this.formatNum(yrRev),
        gross_profit: this.formatNum(yrGross),
        opex: this.formatNum(yrOpex),
        net_profit: this.formatNum(yrNet),
        profit_margin: this.formatNum((yrNet / yrRev) * 100),
        phase_focus: yearPoints[0]?.phase || `Year ${yr - 2025}`
      };
    });

    // Compute City Cluster Real Estate Analysis for the selected state (or Delhi as default)
    const clusterAnalysis = await this.getCityClusterAnalysis(organizationId, filters.state, storePathways);

    return {
      chain_summary: {
        total_stores: storePathways.length,
        current_annual_revenue: this.formatNum(totalBaselineRev),
        current_annual_profit: this.formatNum(totalBaselineProfit),
        projected_2030_revenue: this.formatNum(total2030Rev),
        projected_2030_profit: this.formatNum(total2030Profit),
        total_5year_profit_upside: this.formatNum(totalProfitUpside),
        projected_margin_expansion: this.formatNum(((total2030Profit / Math.max(1, total2030Rev)) - (totalBaselineProfit / Math.max(1, totalBaselineRev))) * 100),
        turnaround_stores_count: storePathways.filter(s => s.baseline.annual_net_profit <= 0).length,
        growth_stores_count: storePathways.filter(s => s.baseline.annual_net_profit > 0).length
      },
      chain_trajectory: chainTrajectory,
      cluster_analysis: clusterAnalysis,
      stores: storePathways
    };
  }

  /**
   * Get single store pathway by ID
   */
  async getStorePathwayById(organizationId, storeId, levers = {}) {
    const all = await this.getAllStorePathways(organizationId, {}, levers);
    const store = all.stores.find(s => s.store_id === storeId);
    if (!store) {
      throw new Error(`Store with ID ${storeId} not found`);
    }
    return {
      chain_summary: all.chain_summary,
      cluster_analysis: all.cluster_analysis,
      store
    };
  }
}

module.exports = new StorePathwayService();
