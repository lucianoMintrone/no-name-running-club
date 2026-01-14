/**
 * NNRC Design System Utilities
 * Helper functions for working with the NNRC design system
 */

/* ========================================
   TEMPERATURE UTILITIES
   ======================================== */

/**
 * Get temperature color class based on temperature value
 */
export function getTemperatureColor(temperature: number): string {
  if (temperature < 0) return 'bg-nnrc-temp-extreme-cold';
  if (temperature < 15) return 'bg-nnrc-temp-very-cold';
  if (temperature < 30) return 'bg-nnrc-temp-cold';
  if (temperature < 40) return 'bg-nnrc-temp-cool';
  return 'bg-nnrc-temp-mild';
}

/**
 * Get temperature text color class
 */
export function getTemperatureTextColor(temperature: number): string {
  if (temperature < 0) return 'text-nnrc-temp-extreme-cold';
  if (temperature < 15) return 'text-nnrc-temp-very-cold';
  if (temperature < 30) return 'text-nnrc-temp-cold';
  if (temperature < 40) return 'text-nnrc-temp-cool';
  return 'text-nnrc-temp-mild';
}

/**
 * Get temperature emoji based on temperature value
 */
export function getTemperatureEmoji(temperature: number): string {
  if (temperature < 0) return '🥶';
  if (temperature < 15) return '❄️';
  if (temperature < 30) return '🧊';
  if (temperature < 40) return '☃️';
  return '🌡️';
}

/**
 * Get temperature label
 */
export function getTemperatureLabel(temperature: number): string {
  if (temperature < 0) return 'Extreme Cold';
  if (temperature < 15) return 'Very Cold';
  if (temperature < 30) return 'Cold';
  if (temperature < 40) return 'Cool';
  return 'Mild';
}

/* ========================================
   CLASS NAME UTILITIES
   ======================================== */

/**
 * Conditionally join class names (like clsx but simpler)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate button classes based on variant
 */
export function getButtonClasses(
  variant: 'primary' | 'secondary' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled: boolean = false
): string {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-200 active:scale-95';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-nnrc-purple text-white hover:bg-nnrc-purple-dark shadow-md hover:shadow-lg',
    secondary: 'bg-nnrc-lavender text-nnrc-purple-dark hover:bg-nnrc-lavender-dark',
    ghost: 'bg-transparent text-nnrc-purple border-2 border-nnrc-purple hover:bg-nnrc-purple hover:text-white',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return cn(baseClasses, sizeClasses[size], variantClasses[variant], disabledClasses);
}

/**
 * Generate card classes with optional hover effect
 */
export function getCardClasses(withHover: boolean = false): string {
  const baseClasses = 'bg-white rounded-xl border-2 border-nnrc-lavender shadow-lg p-6';
  const hoverClasses = withHover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  return cn(baseClasses, hoverClasses);
}

/* ========================================
   FORMAT UTILITIES
   ======================================== */

/**
 * Format temperature with unit
 */
export function formatTemperature(
  temperature: number,
  unit: 'imperial' | 'metric' = 'imperial'
): string {
  if (unit === 'metric') {
    const celsius = Math.round((temperature - 32) * (5 / 9));
    return `${celsius}°C`;
  }
  return `${temperature}°F`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  return formatDate(date);
}

/**
 * Format progress percentage
 */
export function formatProgress(current: number, total: number): string {
  const percentage = Math.round((current / total) * 100);
  return `${current} of ${total} (${percentage}%)`;
}

/* ========================================
   CHALLENGE UTILITIES
   ======================================== */

/**
 * Format challenge title
 */
export function formatChallengeTitle(
  season: 'winter' | 'summer',
  year: string
): string {
  const seasonCapitalized = season.charAt(0).toUpperCase() + season.slice(1);
  return `${seasonCapitalized} ${year} Challenge`;
}

/**
 * Get season emoji
 */
export function getSeasonEmoji(season: 'winter' | 'summer'): string {
  return season === 'winter' ? '❄️' : '☀️';
}

/* ========================================
   VALIDATION UTILITIES
   ======================================== */

/**
 * Validate temperature input
 */
export function validateTemperature(value: string | number): {
  isValid: boolean;
  error?: string;
  value?: number;
} {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (num < -50) {
    return { isValid: false, error: 'Temperature seems too low' };
  }
  
  if (num > 120) {
    return { isValid: false, error: 'Temperature seems too high' };
  }
  
  return { isValid: true, value: Math.round(num) };
}

/**
 * Validate zip code
 */
export function validateZipCode(zipCode: string): {
  isValid: boolean;
  error?: string;
} {
  const cleaned = zipCode.trim();
  
  if (!/^\d{5}(-\d{4})?$/.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid US zip code' };
  }
  
  return { isValid: true };
}

/* ========================================
   ANIMATION UTILITIES
   ======================================== */

/**
 * Generate stagger delay for list animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 50): number {
  return index * baseDelay;
}

/**
 * Create inline style for stagger animation
 */
export function getStaggerStyle(index: number, baseDelay: number = 50): React.CSSProperties {
  return {
    animationDelay: `${getStaggerDelay(index, baseDelay)}ms`,
  };
}

/* ========================================
   RESPONSIVE UTILITIES
   ======================================== */

/**
 * Check if viewport is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if viewport is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if viewport is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

/* ========================================
   COLOR UTILITIES
   ======================================== */

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get contrast color (black or white) for a given background color
 */
export function getContrastColor(backgroundColor: string): 'black' | 'white' {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'black';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
}

/* ========================================
   LOCAL STORAGE UTILITIES
   ======================================== */

/**
 * Safely get item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
}

/* ========================================
   ARRAY UTILITIES
   ======================================== */

/**
 * Chunk array into groups
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Sort leaderboard by temperature (coldest first)
 */
export function sortByTemperature<T extends { temperature: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => a.temperature - b.temperature);
}

/* ========================================
   EXPORT ALL
   ======================================== */

export default {
  // Temperature
  getTemperatureColor,
  getTemperatureTextColor,
  getTemperatureEmoji,
  getTemperatureLabel,
  formatTemperature,
  
  // Class names
  cn,
  getButtonClasses,
  getCardClasses,
  
  // Formatting
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatProgress,
  
  // Challenge
  formatChallengeTitle,
  getSeasonEmoji,
  
  // Validation
  validateTemperature,
  validateZipCode,
  
  // Animation
  getStaggerDelay,
  getStaggerStyle,
  
  // Responsive
  isMobile,
  isTablet,
  isDesktop,
  
  // Color
  hexToRgb,
  getContrastColor,
  
  // Storage
  getLocalStorage,
  setLocalStorage,
  
  // Array
  chunkArray,
  sortByTemperature,
};
