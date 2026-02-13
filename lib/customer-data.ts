// Customer data processing utilities
// This processes the customers-1000.csv data for dashboard visualizations

export interface Customer {
  index: number;
  customerId: string;
  firstName: string;
  lastName: string;
  company: string;
  city: string;
  country: string;
  phone1: string;
  phone2: string;
  email: string;
  subscriptionDate: Date;
  website: string;
}

export interface CountryStats {
  name: string;
  value: number;
}

export interface MonthlyStats {
  month: string;
  count: number;
  cumulative: number;
}

export interface CompanyStats {
  name: string;
  count: number;
}

// Parse CSV data
export function parseCustomerCSV(csvContent: string): Customer[] {
  const lines = csvContent.trim().split('\n');
  const customers: Customer[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 12) {
      customers.push({
        index: parseInt(values[0]) || i,
        customerId: values[1],
        firstName: values[2],
        lastName: values[3],
        company: values[4],
        city: values[5],
        country: values[6],
        phone1: values[7],
        phone2: values[8],
        email: values[9],
        subscriptionDate: new Date(values[10]),
        website: values[11],
      });
    }
  }
  
  return customers;
}

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Get customers by country
export function getCustomersByCountry(customers: Customer[]): CountryStats[] {
  const countryMap = new Map<string, number>();
  
  customers.forEach(customer => {
    const count = countryMap.get(customer.country) || 0;
    countryMap.set(customer.country, count + 1);
  });
  
  return Array.from(countryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// Get top countries (limit results)
export function getTopCountries(customers: Customer[], limit: number = 10): CountryStats[] {
  const stats = getCustomersByCountry(customers);
  const top = stats.slice(0, limit);
  const otherCount = stats.slice(limit).reduce((sum, s) => sum + s.value, 0);
  
  if (otherCount > 0) {
    top.push({ name: 'Others', value: otherCount });
  }
  
  return top;
}

// Get monthly subscription stats
export function getMonthlySubscriptions(customers: Customer[]): MonthlyStats[] {
  const monthMap = new Map<string, number>();
  
  customers.forEach(customer => {
    const date = customer.subscriptionDate;
    if (date && !isNaN(date.getTime())) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const count = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, count + 1);
    }
  });
  
  const sortedMonths = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b));
  
  let cumulative = 0;
  return sortedMonths.map(([month, count]) => {
    cumulative += count;
    return {
      month: formatMonth(month),
      count,
      cumulative
    };
  });
}

// Format month for display
function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

// Get top companies by customer count
export function getTopCompanies(customers: Customer[], limit: number = 10): CompanyStats[] {
  const companyMap = new Map<string, number>();
  
  customers.forEach(customer => {
    if (customer.company) {
      const count = companyMap.get(customer.company) || 0;
      companyMap.set(customer.company, count + 1);
    }
  });
  
  return Array.from(companyMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Get subscription by year
export function getSubscriptionsByYear(customers: Customer[]): { year: string; count: number }[] {
  const yearMap = new Map<string, number>();
  
  customers.forEach(customer => {
    const date = customer.subscriptionDate;
    if (date && !isNaN(date.getTime())) {
      const year = date.getFullYear().toString();
      const count = yearMap.get(year) || 0;
      yearMap.set(year, count + 1);
    }
  });
  
  return Array.from(yearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

// Get quarterly stats
export function getQuarterlyStats(customers: Customer[]): { quarter: string; count: number }[] {
  const quarterMap = new Map<string, number>();
  
  customers.forEach(customer => {
    const date = customer.subscriptionDate;
    if (date && !isNaN(date.getTime())) {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const key = `Q${quarter} ${date.getFullYear()}`;
      const count = quarterMap.get(key) || 0;
      quarterMap.set(key, count + 1);
    }
  });
  
  return Array.from(quarterMap.entries())
    .map(([quarter, count]) => ({ quarter, count }))
    .sort((a, b) => {
      const [qa, ya] = a.quarter.split(' ');
      const [qb, yb] = b.quarter.split(' ');
      return ya.localeCompare(yb) || qa.localeCompare(qb);
    });
}

// Get customers by city (top N)
export function getTopCities(customers: Customer[], limit: number = 15): CountryStats[] {
  const cityMap = new Map<string, number>();
  
  customers.forEach(customer => {
    if (customer.city) {
      const count = cityMap.get(customer.city) || 0;
      cityMap.set(customer.city, count + 1);
    }
  });
  
  return Array.from(cityMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

// Get domain distribution from websites
export function getDomainDistribution(customers: Customer[]): { domain: string; count: number }[] {
  const domainMap = new Map<string, number>();
  
  customers.forEach(customer => {
    if (customer.website) {
      try {
        const url = new URL(customer.website);
        const tld = url.hostname.split('.').pop() || 'other';
        const count = domainMap.get(tld) || 0;
        domainMap.set(tld, count + 1);
      } catch {
        // Skip invalid URLs
      }
    }
  });
  
  return Array.from(domainMap.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

// Get continent groupings
const continentMapping: Record<string, string> = {
  'United States of America': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'Brazil': 'South America',
  'Argentina': 'South America',
  'Chile': 'South America',
  'Colombia': 'South America',
  'Peru': 'South America',
  'United Kingdom': 'Europe',
  'Germany': 'Europe',
  'France': 'Europe',
  'Italy': 'Europe',
  'Spain': 'Europe',
  'Netherlands': 'Europe',
  'Switzerland': 'Europe',
  'Sweden': 'Europe',
  'Norway': 'Europe',
  'Denmark': 'Europe',
  'Poland': 'Europe',
  'Austria': 'Europe',
  'Belgium': 'Europe',
  'Ireland': 'Europe',
  'Portugal': 'Europe',
  'Greece': 'Europe',
  'Finland': 'Europe',
  'Czech Republic': 'Europe',
  'Hungary': 'Europe',
  'Romania': 'Europe',
  'Liechtenstein': 'Europe',
  'Latvia': 'Europe',
  'China': 'Asia',
  'Japan': 'Asia',
  'India': 'Asia',
  'Korea': 'Asia',
  'Singapore': 'Asia',
  'Thailand': 'Asia',
  'Vietnam': 'Asia',
  'Malaysia': 'Asia',
  'Indonesia': 'Asia',
  'Philippines': 'Asia',
  'Taiwan': 'Asia',
  'Hong Kong': 'Asia',
  'Macao': 'Asia',
  'Nepal': 'Asia',
  'Bangladesh': 'Asia',
  'Sri Lanka': 'Asia',
  'Pakistan': 'Asia',
  'Australia': 'Oceania',
  'New Zealand': 'Oceania',
  'Fiji': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'South Africa': 'Africa',
  'Nigeria': 'Africa',
  'Kenya': 'Africa',
  'Egypt': 'Africa',
  'Morocco': 'Africa',
  'Ghana': 'Africa',
  'Ethiopia': 'Africa',
  'Uganda': 'Africa',
  'Sudan': 'Africa',
  'Burundi': 'Africa',
};

export function getCustomersByContinent(customers: Customer[]): CountryStats[] {
  const continentMap = new Map<string, number>();
  
  customers.forEach(customer => {
    const continent = continentMapping[customer.country] || 'Other';
    const count = continentMap.get(continent) || 0;
    continentMap.set(continent, count + 1);
  });
  
  return Array.from(continentMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// Calculate growth metrics
export function calculateGrowthMetrics(customers: Customer[]) {
  // Since this is historical data, let's use the last available months
  const monthly = getMonthlySubscriptions(customers);
  const lastTwo = monthly.slice(-2);
  
  const currentMonthCount = lastTwo[1]?.count || 0;
  const previousMonthCount = lastTwo[0]?.count || 0;
  
  const growthRate = previousMonthCount > 0 
    ? ((currentMonthCount - previousMonthCount) / previousMonthCount * 100).toFixed(1)
    : '0';
  
  const totalCustomers = customers.length;
  const uniqueCountries = new Set(customers.map(c => c.country)).size;
  const uniqueCompanies = new Set(customers.map(c => c.company)).size;
  
  // Calculate average customers per month
  const avgPerMonth = monthly.length > 0 
    ? Math.round(totalCustomers / monthly.length)
    : 0;
  
  return {
    totalCustomers,
    uniqueCountries,
    uniqueCompanies,
    growthRate: parseFloat(growthRate),
    avgPerMonth,
    lastMonthCount: currentMonthCount,
  };
}
