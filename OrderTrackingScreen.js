import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import io from 'socket.io-client';
import { requestLocationPermissions } from './permissions';

const SOCKET_SERVER_URL = 'http://IP:3000';

const OrderTrackingScreen = () => {
  const [location, setLocation] = useState(null);
  const socketRef = useRef(null);
  let watchId = useRef(null);  

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
                transports: ['websocket'],
            });

    const getPermissionsAndWatchLocation = async () => {
      const granted = await requestLocationPermissions();
      if (!granted) {
        Alert.alert('Permission Required', 'Location permission is needed.');
        return;
      }

      watchId.current = Geolocation.watchPosition(
        position => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          socketRef.current.emit('locationUpdate', newLocation);
        },
        error => {
          console.error(error);
          Alert.alert('Error', 'Failed to get location');
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 2000,
        }
      );
    };

    getPermissionsAndWatchLocation();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      Geolocation.stopObserving();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Order is on the Way!</Text>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker coordinate={location} title="Delivery Partner" />
      </MapView>
    </View>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 20, textAlign: 'center', marginTop: 20, fontWeight: '600' },
  map: { flex: 1, marginVertical: 10 },
});
