import * as Location from 'expo-location';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function requestBackgroundPermission(): Promise<boolean> {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<Location.LocationObject> {
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
}

export function startLocationUpdates(
  onLocation: (location: Location.LocationObject) => void
): () => void {
  let cancelled = false;

  const watch = async () => {
    while (!cancelled) {
      try {
        const loc = await getCurrentLocation();
        onLocation(loc);
      } catch {}
      await new Promise((r) => setTimeout(r, 5000));
    }
  };

  watch();

  return () => {
    cancelled = true;
  };
}
