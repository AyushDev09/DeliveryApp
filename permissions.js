import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export async function requestLocationPermissions() {
  if (Platform.OS === 'android') {
    const fineLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'We need access to your location.',
        buttonPositive: 'OK',
      }
    );

    if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) return false;

    if (Platform.Version >= 29) {
      const backgroundLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message: 'We need access to your location in the background.',
          buttonPositive: 'OK',
        }
      );

      if (backgroundLocation !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Required',
          'To track delivery in background, allow location "All the time".',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    }
  }

  return true;
}
