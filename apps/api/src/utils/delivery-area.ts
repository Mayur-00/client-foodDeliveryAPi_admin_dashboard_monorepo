import { ApiError } from "./apiError.js";

export const DELIVERY_CENTER = {
  latitude: 19.603495292721032,
  longitude: 78.20578031383049,
} as const;

export const DELIVERY_RADIUS_KM = 10;

export function distanceFromDeliveryCenterKm(latitude: number, longitude: number) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(latitude - DELIVERY_CENTER.latitude);
  const longitudeDelta = toRadians(longitude - DELIVERY_CENTER.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(DELIVERY_CENTER.latitude)) *
      Math.cos(toRadians(latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function assertInsideDeliveryArea(latitude: number, longitude: number) {
  if (distanceFromDeliveryCenterKm(latitude, longitude) > DELIVERY_RADIUS_KM) {
    throw new ApiError(
      403,
      "Signup is available only within 10 km of the service area",
      "OUTSIDE_DELIVERY_AREA",
    );
  }
}
