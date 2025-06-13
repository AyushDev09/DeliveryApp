import { PermissionsAndroid, Platform } from 'react-native';

export async function requestLocationPermissions() {
  if (Platform.OS === 'android') {
    const hasFineLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (!hasFineLocation) {
      const fineLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location.',
          buttonPositive: 'OK',
        }
      );

      if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }
    }
  }
  return true;
}
