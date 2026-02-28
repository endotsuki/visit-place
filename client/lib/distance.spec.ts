import { describe, it, expect } from 'vitest';
import { calculateDistance, distanceFromPhnomPenh, PHNOM_PENH_LAT, PHNOM_PENH_LNG } from './distance';

// Small test suite to ensure our geolocation helpers remain correct

describe('distance utilities', () => {
  it('should return zero for identical points', () => {
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
  });

  it('distanceFromPhnomPenh should be zero at the same coordinates', () => {
    expect(distanceFromPhnomPenh(PHNOM_PENH_LAT, PHNOM_PENH_LNG)).toBeCloseTo(0, 5);
  });

  it('Angkor Wat is roughly 314 km from Phnom Penh', () => {
    const angkorLat = 13.3667;
    const angkorLng = 103.8667;
    const dist = distanceFromPhnomPenh(angkorLat, angkorLng);
    expect(dist).toBeGreaterThan(310);
    expect(dist).toBeLessThan(320);
  });
});
