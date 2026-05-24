import { Location } from '../types';

export function calculateDistance(a: Location, b: Location): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const x =
    sinLat * sinLat +
    Math.cos((a.latitude * Math.PI) / 180) *
      Math.cos((b.latitude * Math.PI) / 180) *
      sinLon *
      sinLon;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export function generateMockLocation(base: Location): Location {
  const offsetLat = (Math.random() - 0.5) * 0.01;
  const offsetLng = (Math.random() - 0.5) * 0.01;
  return {
    latitude: base.latitude + offsetLat,
    longitude: base.longitude + offsetLng,
    address: base.address,
  };
}
