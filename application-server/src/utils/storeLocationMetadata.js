/**
 * Specific Commercial Physical Location and Catchment Metadata for all 30 Outlets
 */
const STORE_SPECIFIC_LOCATIONS = {
  // Delhi NCR
  'STR-DELH-110001-L': {
    locality: 'Connaught Place, Inner Circle (Block B)',
    address: 'B-12/14, Inner Circle, Connaught Place, New Delhi - 110001',
    landmark: 'Opposite PVR Plaza Cinema, Near Rajiv Chowk Gate 2',
    trading_format: 'Central Flagship Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Rajesh Malhotra',
    contact_phone: '+91 11 4152 8801',
    operating_hours: '08:00 AM - 10:30 PM'
  },
  'STR-DELH-110001-M': {
    locality: 'Karol Bagh, Ajmal Khan Road',
    address: '54/1, Ajmal Khan Road, Karol Bagh, Central Delhi - 110005',
    landmark: 'Near Metro Pillar 114, Opposite Roopak Stores',
    trading_format: 'Neighborhood Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Pooja Verma',
    contact_phone: '+91 11 4250 9922',
    operating_hours: '08:30 AM - 10:00 PM'
  },
  'STR-DELH-110001-S': {
    locality: 'Barakhamba Road, Metro Concourse',
    address: 'Shop 4, Lower Ground Concourse, Barakhamba Metro Station, Connaught Place - 110001',
    landmark: 'Adjacent to Exit Gate 3, Near Statesman House',
    trading_format: 'High-Density Commuter Express (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Amitabh Sharma',
    contact_phone: '+91 11 4321 0033',
    operating_hours: '07:30 AM - 11:00 PM'
  },

  // Maharashtra (Mumbai)
  'STR-MAHA-400001-L': {
    locality: 'Fort, Horniman Circle Heritage Precinct',
    address: '18/22, Sir P.M. Road, Fort, South Mumbai - 400001',
    landmark: 'Near Asiatic Library, Opposite Reserve Bank of India Old Building',
    trading_format: 'Heritage District Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Vikramaditya Deshmukh',
    contact_phone: '+91 22 2266 1101',
    operating_hours: '08:00 AM - 10:30 PM'
  },
  'STR-MAHA-400001-M': {
    locality: 'Bandra West, Linking Road',
    address: '244, Waterfield Road Junction, Linking Road, Bandra West - 400050',
    landmark: 'Opposite National College, Near KFC Junction',
    trading_format: 'Upscale Suburban Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Sneha Kulkarni',
    contact_phone: '+91 22 2640 4422',
    operating_hours: '08:30 AM - 10:30 PM'
  },
  'STR-MAHA-400001-S': {
    locality: 'CSMT Station Suburban Subway',
    address: 'Subway Kiosk 8, Chhatrapati Shivaji Maharaj Terminus, Fort - 400001',
    landmark: 'Suburban Platform 1 Concourse, Near Ticket Counter 4',
    trading_format: 'Transit Commuter Express (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Rohan Shinde',
    contact_phone: '+91 22 2270 5533',
    operating_hours: '06:30 AM - 11:30 PM'
  },

  // Karnataka (Bengaluru)
  'STR-KARN-560001-L': {
    locality: 'MG Road, Trinity Circle',
    address: '1/4, Swami Vivekananda Road, Trinity Circle, MG Road, Bengaluru - 560001',
    landmark: 'Near Taj MG Road, Opposite Trinity Metro Station',
    trading_format: 'Central Metro Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Karthik Narayanan',
    contact_phone: '+91 80 2558 7701',
    operating_hours: '08:00 AM - 10:30 PM'
  },
  'STR-KARN-560001-M': {
    locality: 'Indiranagar, 100 Feet Road',
    address: '612, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    landmark: 'Corner of 12th Main Junction, Near Toit Brewpub',
    trading_format: 'Modern Trade Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Deepa Rao',
    contact_phone: '+91 80 4115 8822',
    operating_hours: '08:00 AM - 10:00 PM'
  },
  'STR-KARN-560001-S': {
    locality: 'Cubbon Park Metro Concourse',
    address: 'Station Retail Deck, Cubbon Park Metro, Kasturba Road - 560001',
    landmark: 'High Court & Vidhana Soudha Exit Gate',
    trading_format: 'Rapid Transit Express (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Praveen Gowda',
    contact_phone: '+91 80 2221 3344',
    operating_hours: '07:00 AM - 11:00 PM'
  },

  // Tamil Nadu (Chennai)
  'STR-TAMI-600001-L': {
    locality: 'George Town, NSC Bose Road (Parry\'s Corner)',
    address: '142, NSC Bose Road, George Town, Chennai - 600001',
    landmark: 'Opposite Madras High Court Gate 4, Near Parry House',
    trading_format: 'Commercial Hub Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'S. Ramanathan',
    contact_phone: '+91 44 2534 8801',
    operating_hours: '08:00 AM - 10:00 PM'
  },
  'STR-TAMI-600001-M': {
    locality: 'T. Nagar, Usman Road',
    address: '78, South Usman Road, T. Nagar, Chennai - 600017',
    landmark: 'Near Panagal Park Flyover, Opposite Saravana Stores',
    trading_format: 'High-Density Shopping Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Ananya Sundaram',
    contact_phone: '+91 44 2434 9911',
    operating_hours: '08:30 AM - 10:30 PM'
  },
  'STR-TAMI-600001-S': {
    locality: 'Chennai Central Suburban Subway',
    address: 'Retail Unit 12, Puratchi Thalaivar Dr. MGR Central Station, Chennai - 600003',
    landmark: 'Moore Market Complex Underpass Exit',
    trading_format: 'Commuter Express Outlet (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Murugan Velu',
    contact_phone: '+91 44 2535 0022',
    operating_hours: '06:00 AM - 11:30 PM'
  },

  // West Bengal (Kolkata)
  'STR-WEST-700001-L': {
    locality: 'BBD Bagh, Dalhousie Square East',
    address: '6, Council House Street, BBD Bagh East, Kolkata - 700001',
    landmark: 'Near Raj Bhavan North Gate, Behind Writers\' Building',
    trading_format: 'CBD Commercial Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Subhashish Banerjee',
    contact_phone: '+91 33 2248 1101',
    operating_hours: '08:30 AM - 09:30 PM'
  },
  'STR-WEST-700001-M': {
    locality: 'Park Street, Camac Street Hub',
    address: '22, Camac Street, Park Street Crossing, Kolkata - 700016',
    landmark: 'Opposite Industry House, Near Allen Park',
    trading_format: 'Upscale Central Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Debolina Sen',
    contact_phone: '+91 33 2287 4411',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-WEST-700001-S': {
    locality: 'Esplanade Metro Interchange',
    address: 'Underground Arcade Unit 3, Esplanade Metro, Chowringhee - 700013',
    landmark: 'Dharmatala Bus Depot Exit Underpass',
    trading_format: 'Transit Express Hub (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Amitava Roy',
    contact_phone: '+91 33 2249 2233',
    operating_hours: '07:30 AM - 10:30 PM'
  },

  // Gujarat (Ahmedabad)
  'STR-GUJA-380001-L': {
    locality: 'Bhadra Plaza, Teen Darwaja Old City',
    address: '112, Lal Darwaja Road, Bhadra Fort Square, Ahmedabad - 380001',
    landmark: 'Opposite Bhadra Kali Temple, Near Premabhai Hall',
    trading_format: 'Heritage Center Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Jignesh Patel',
    contact_phone: '+91 79 2550 8801',
    operating_hours: '08:30 AM - 10:00 PM'
  },
  'STR-GUJA-380001-M': {
    locality: 'Navrangpura, CG Road Commercial Belt',
    address: '401, Supermall Complex, CG Road, Navrangpura, Ahmedabad - 380009',
    landmark: 'Near Municipal Market Cross Road',
    trading_format: 'Modern High-Street Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Bhavna Shah',
    contact_phone: '+91 79 2646 7711',
    operating_hours: '09:00 AM - 10:30 PM'
  },
  'STR-GUJA-380001-S': {
    locality: 'Lal Darwaja AMTS Terminal',
    address: 'Shop 7, City Civic Terminal Arcade, Lal Darwaja, Ahmedabad - 380001',
    landmark: 'Riverfront Walkway Access Gate',
    trading_format: 'Commuter Express Kiosk (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Chirag Mehta',
    contact_phone: '+91 79 2551 2233',
    operating_hours: '07:00 AM - 11:00 PM'
  },

  // Rajasthan (Jaipur)
  'STR-RAJA-302001-L': {
    locality: 'Mirza Ismail (M.I.) Road, Central',
    address: '14, Gangwal Building, M.I. Road, Jaipur - 302001',
    landmark: 'Near Raj Mandir Cinema, Opposite Niros Restaurant',
    trading_format: 'High-Street Showroom Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Kuldeep Singh Rathore',
    contact_phone: '+91 141 237 8801',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-RAJA-302001-M': {
    locality: 'C-Scheme, Ashok Nagar',
    address: 'C-32, Malviya Marg, C-Scheme, Jaipur - 302001',
    landmark: 'Near Statue Circle & Central Park Gate 2',
    trading_format: 'Upscale Residential Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Meenakshi Sharma',
    contact_phone: '+91 141 236 4411',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-RAJA-302001-S': {
    locality: 'Sindhi Camp Central Bus Terminal',
    address: 'Platform 2 Forecourt, Central Bus Terminal, Station Road, Jaipur - 302001',
    landmark: 'Main Passenger Waiting Lounge Entry',
    trading_format: 'Transit Convenience Shop (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Gajendra Meena',
    contact_phone: '+91 141 220 3322',
    operating_hours: '06:00 AM - 11:30 PM'
  },

  // Punjab (Chandigarh)
  'STR-PUNJ-160001-L': {
    locality: 'Sector 17-C, Plaza Commercial Complex',
    address: 'SCO 118-120, Sector 17-C, City Centre Plaza, Chandigarh - 160017',
    landmark: 'Opposite Neelam Cinema, Near Bridge Market Fountain',
    trading_format: 'City Centre Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Harpreet Singh Dhillon',
    contact_phone: '+91 172 270 8801',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-PUNJ-160001-M': {
    locality: 'Sector 35-B, Market Corridor',
    address: 'SCO 42-43, Sector 35-B Inner Market, Chandigarh - 160035',
    landmark: 'Near JW Marriott Roundabout & Sindhi Sweets',
    trading_format: 'Neighborhood Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Gurmeet Kaur',
    contact_phone: '+91 172 260 7711',
    operating_hours: '09:00 AM - 10:30 PM'
  },
  'STR-PUNJ-160001-S': {
    locality: 'ISBT Sector 17 Transit Bay',
    address: 'Shop 5, Inter-State Bus Terminus, Sector 17, Chandigarh - 160017',
    landmark: 'Express Departure Bay 1 Concourse',
    trading_format: 'Rapid Express Outlet (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Manjit Singh',
    contact_phone: '+91 172 271 2233',
    operating_hours: '06:30 AM - 11:00 PM'
  },

  // Uttar Pradesh (Lucknow)
  'STR-UTTA-226001-L': {
    locality: 'Hazratganj, Mahatma Gandhi Marg',
    address: '32, Mayfair Building, Mahatma Gandhi Marg, Hazratganj, Lucknow - 226001',
    landmark: 'Near GPO Crossing, Opposite Sahu Cinema',
    trading_format: 'Heritage High-Street Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Alok Srivastava',
    contact_phone: '+91 522 262 8801',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-UTTA-226001-M': {
    locality: 'Aliganj, Kapoorthala Hub',
    address: 'B-12, Pragati Kendra, Kapoorthala Commercial Complex, Aliganj - 226024',
    landmark: 'Opposite Head Post Office, Near Novelty Aliganj',
    trading_format: 'Dense Residential Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Rashmi Tiwari',
    contact_phone: '+91 522 237 9911',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-UTTA-226001-S': {
    locality: 'Charbagh Railway Concourse',
    address: 'Unit 9, Northern Railway Station Outer Arcade, Charbagh, Lucknow - 226004',
    landmark: 'Main Porch Taxi Stand Entrance',
    trading_format: 'Commuter Express Kiosk (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Virendra Yadav',
    contact_phone: '+91 522 263 4422',
    operating_hours: '06:00 AM - 11:30 PM'
  },

  // Madhya Pradesh (Bhopal)
  'STR-MADH-462001-L': {
    locality: 'MP Nagar Zone-I, Commercial Hub',
    address: 'Plot 14-B, Chetak Complex, MP Nagar Zone-I, Bhopal - 462011',
    landmark: 'Opposite Jyoti Cineplex, Near Sargam Talkies Square',
    trading_format: 'City Central Hypermarket (12,000 sq ft)',
    sqft: 12000,
    staff_count: 24,
    manager_name: 'Dharmendra Chouhan',
    contact_phone: '+91 755 255 8801',
    operating_hours: '09:00 AM - 10:00 PM'
  },
  'STR-MADH-462001-M': {
    locality: 'New Market, TT Nagar',
    address: 'Shop 84-86, Top Floor Market, TT Nagar, Bhopal - 462003',
    landmark: 'Near Roshanpura Square, Opposite Jain Mandir',
    trading_format: 'Community Retail Supermarket (6,500 sq ft)',
    sqft: 6500,
    staff_count: 14,
    manager_name: 'Sunita Saxena',
    contact_phone: '+91 755 277 4411',
    operating_hours: '09:30 AM - 10:00 PM'
  },
  'STR-MADH-462001-S': {
    locality: 'Bhopal Junction Hamidia Arcade',
    address: 'Shop 18, Railway Station Frontage, Hamidia Road, Bhopal - 462001',
    landmark: 'Platform 1 Main Portico Entrance',
    trading_format: 'Transit Convenience Mart (3,200 sq ft)',
    sqft: 3200,
    staff_count: 7,
    manager_name: 'Mahesh Vishwakarma',
    contact_phone: '+91 755 273 1122',
    operating_hours: '06:30 AM - 11:30 PM'
  }
};

/**
 * Returns specific location details for a store code, or a structured default.
 */
function getSpecificLocation(storeCode, state = 'Delhi', outletType = 'Medium') {
  if (STORE_SPECIFIC_LOCATIONS[storeCode]) {
    return STORE_SPECIFIC_LOCATIONS[storeCode];
  }

  // Fallback generation for any dynamic or test store
  const sqft = outletType === 'Large' ? 12000 : outletType === 'Medium' ? 6500 : 3200;
  const staff = outletType === 'Large' ? 24 : outletType === 'Medium' ? 14 : 7;
  return {
    locality: `${state} Commercial District`,
    address: `Plot 101, Main High Street Road, ${state}`,
    landmark: `Near Central Metro Interchange`,
    trading_format: `${outletType} Retail Store (${sqft.toLocaleString()} sq ft)`,
    sqft,
    staff_count: staff,
    manager_name: 'Store Operations Supervisor',
    contact_phone: '+91 1800 200 8899',
    operating_hours: '08:30 AM - 10:00 PM'
  };
}

module.exports = {
  STORE_SPECIFIC_LOCATIONS,
  getSpecificLocation
};
