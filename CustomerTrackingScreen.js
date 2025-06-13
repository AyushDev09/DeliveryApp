import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.7:3000';

const fallbackRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export default function CustomerTrackingScreen() {
    const [location, setLocation] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
        });

        socketRef.current.on('locationUpdate', coords => {
            if (coords && coords.latitude && coords.longitude) {
                setLocation({ latitude: coords.latitude, longitude: coords.longitude });
            }
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    return (
        <View style={styles.container}>
            {!location ? (
                <Text style={styles.heading}>Waiting for delivery partner location...</Text>
            ) : (
                <>
                    <Text style={styles.heading}>Delivery partner is nearby!</Text>
                    <MapView
                        style={styles.map}
                        region={{ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                        showsUserLocation={false}
                    >
                        <Marker coordinate={location} title="Delivery Partner" />
                    </MapView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    heading: { marginTop: 20, fontSize: 18, textAlign: 'center' },
    map: { flex: 1 },
});
