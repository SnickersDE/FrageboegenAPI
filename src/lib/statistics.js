// Basic Statistics
export const mean = (data) => {
  if (!data || data.length === 0) return 0
  return data.reduce((a, b) => a + b, 0) / data.length
}

export const variance = (data) => {
  if (!data || data.length === 0) return 0
  const m = mean(data)
  return data.reduce((a, b) => a + Math.pow(b - m, 2), 0) / data.length
}

export const stdDev = (data) => Math.sqrt(variance(data))

export const covariance = (x, y) => {
  if (x.length !== y.length || x.length === 0) return 0
  const xMean = mean(x)
  const yMean = mean(y)
  let sum = 0
  for (let i = 0; i < x.length; i++) {
    sum += (x[i] - xMean) * (y[i] - yMean)
  }
  return sum / x.length
}

export const median = (data) => {
  if (!data || data.length === 0) return 0
  const sorted = [...data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

// Pearson Correlation (r)
export const pearson = (x, y) => {
  if (x.length !== y.length) return 0
  const cov = covariance(x, y)
  const sx = stdDev(x)
  const sy = stdDev(y)
  if (sx === 0 || sy === 0) return 0
  return cov / (sx * sy)
}

// Spearman Rank Correlation (rho)
export const spearman = (x, y) => {
  const rank = (arr) => {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
    const ranks = new Array(arr.length)
    for (let i = 0; i < sorted.length; i++) {
      // Handle ties? Simple ranking for now
      ranks[sorted[i].i] = i + 1
    }
    return ranks
  }
  const rx = rank(x)
  const ry = rank(y)
  return pearson(rx, ry)
}

// Point-Biserial Correlation
// Mathematically equivalent to Pearson if binary variable is mapped to 0 and 1
export const pointBiserial = (binary, metric) => {
  return pearson(binary, metric)
}

// Partial Correlation (r_xy.z)
// Controls for z
export const partial = (x, y, z) => {
  const rxy = pearson(x, y)
  const rxz = pearson(x, z)
  const ryz = pearson(y, z)
  
  const denominator = Math.sqrt((1 - rxz * rxz) * (1 - ryz * ryz))
  if (denominator === 0) return 0
  return (rxy - rxz * ryz) / denominator
}

// Calculate p-value for correlation (approximate t-distribution)
export const pValue = (r, n) => {
  if (Math.abs(r) >= 1) return 0
  const t = r * Math.sqrt((n - 2) / (1 - r * r))
  // Use betaInc to calculate correct p-value for Student's t
  const df = n - 2
  if (df <= 0) return 1
  const x = df / (df + t * t)
  return betaInc(x, 0.5 * df, 0.5)
}

// Log Gamma Function (Lanczos Approximation)
function logGamma(n) {
  var x = n;
  var tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  var ser = 1.000000000190015;
  var cof = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  for (var j = 0; j <= 5; j++) {
    ser += cof[j] / ++x;
  }
  return -tmp + Math.log(2.5066282746310005 * ser / n);
}

// Regularized Incomplete Beta Function Ix(a, b)
function betaInc(x, a, b) {
  if (x < 0 || x > 1) return 0;
  
  var lbeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - betaInc(1 - x, b, a);
  }
  
  var prefactor = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
  
  // Lentz's method for continued fraction
  var f = 1.0;
  var c = 1.0;
  var d = 0.0;
  
  var i, m, numerator;
  for (i = 1; i <= 200; i++) {
    if (i % 2 === 0) {
      m = i / 2;
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    } else {
      m = (i - 1) / 2;
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    }
    
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    
    var delta = c * d;
    f *= delta;
    
    if (Math.abs(delta - 1) < 1e-8) break;
  }
  
  return prefactor * (1 / f);
}

export const tTest = (group1, group2) => {
  if (!group1 || group1.length < 2 || !group2 || group2.length < 2) return null

  const n1 = group1.length
  const n2 = group2.length
  const m1 = mean(group1)
  const m2 = mean(group2)
  const v1 = variance(group1)
  const v2 = variance(group2)

  // Welch's t-test (unequal variances)
  const se = Math.sqrt((v1 / n1) + (v2 / n2))
  if (se === 0) return { t: 0, p: 1, df: n1 + n2 - 2, significant: false }
  
  const t = (m1 - m2) / se
  
  // Welch-Satterthwaite df
  const num = Math.pow((v1 / n1) + (v2 / n2), 2)
  const den = (Math.pow(v1 / n1, 2) / (n1 - 1)) + (Math.pow(v2 / n2, 2) / (n2 - 1))
  const df = num / den

  // p-value calculation using Beta Regularized
  // For two-tailed test: p = I_x(df/2, 1/2) where x = df / (df + t^2)
  const x = df / (df + t * t)
  const pValue = betaInc(x, 0.5 * df, 0.5)

  // Ensure p-value is between 0 and 1
  const p = Math.max(0, Math.min(1, pValue))
  
  let interpretation = ""
  if (p < 0.001) interpretation = "Hoch signifikanter Unterschied (p < .001)"
  else if (p < 0.01) interpretation = "Sehr signifikanter Unterschied (p < .01)"
  else if (p < 0.05) interpretation = "Signifikanter Unterschied (p < .05)"
  else interpretation = "Kein signifikanter Unterschied (p > .05)"

  return {
    t: t,
    df: df,
    p: p,
    interpretation
  }
}
