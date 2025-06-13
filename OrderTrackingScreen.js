import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useStore from './store';
import { requestLocationPermissions } from './permissions';
import Geolocation from 'react-native-geolocation-service';

const OrderTrackingScreen = () => {
    const order = useStore(state => state.order);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const getPermissionsAndWatchLocation = async () => {
            const granted = await requestLocationPermissions();
            if (!granted) {
                Alert.alert(
                    'Permission Required',
                    'Location permission is needed to track your delivery.'
                );
                return;
            }

            Geolocation.watchPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error(error);
                    Alert.alert('Error', 'Failed to get location');
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10, // update only if moved 10 meters
                    interval: 5000, // Android
                    fastestInterval: 2000, // Android
                    showsBackgroundLocationIndicator: true, // iOS
                }
            );
        };

        getPermissionsAndWatchLocation();

        // Clear watch on unmount
        return () => {
            Geolocation.stopObserving();
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
                    ...location,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
            >
                <Marker coordinate={location} title="Delivery Partner" />
            </MapView>

            <View style={styles.orderSummary}>
                <Text style={styles.subHeading}>Order Summary</Text>
                {order?.map((item, idx) => (
                    <Text key={idx}>
                        {item.name} x{item.quantity} - ${item.price * item.quantity}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    heading: { fontSize: 20, textAlign: 'center', marginTop: 20, fontWeight: '600' },
    map: { flex: 1, marginVertical: 10 },
    orderSummary: { padding: 15, backgroundColor: '#fff' },
    subHeading: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
});
