import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Keyboard } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { Searchbar, FAB, ActivityIndicator, useTheme, Surface } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Custom OSM Style URL (Standard)
const OSM_TEMPLATE = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function MapScreen() {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { session } = useAuth();
    const mapRef = useRef<MapView>(null);

    const [region, setRegion] = useState({
        latitude: 51.1657, // Default Germany center
        longitude: 10.4515,
        latitudeDelta: 5.0,
        longitudeDelta: 5.0,
    });

    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState<{ latitude: number, longitude: number } | null>(null);
    const [routeCoords, setRouteCoords] = useState<{ latitude: number, longitude: number }[]>([]);

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                startTracking();
            } else {
                Alert.alert('Permission Denied', 'Location permission is required for navigation.');
            }
        } else {
            startTracking(); // iOS handles differently via Info.plist usually, but Geolocation library handles request
        }
    };

    const startTracking = () => {
        Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLoc = { latitude, longitude };
                setUserLocation(newLoc);

                // Upload to Supabase if logged in
                if (session?.user) {
                    supabase.from('user_locations').insert({
                        user_id: session.user.id,
                        latitude,
                        longitude,
                    }).then(({ error }) => {
                        if (error) console.log('Location upload error:', error);
                    });
                }
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 10, interval: 10000, fastestInterval: 5000 }
        );
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        Keyboard.dismiss();
        setLoading(true);
        try {
            // Nominatim Search
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const dest = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
                setDestination(dest);

                // Animated move
                mapRef.current?.animateToRegion({
                    ...dest,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }, 1000);

                if (userLocation) {
                    fetchRoute(userLocation, dest);
                }
            } else {
                Alert.alert('Not Found', 'Location not found.');
            }
        } catch (err) {
            Alert.alert('Error', 'Search failed.');
        }
        setLoading(false);
    };

    const fetchRoute = async (start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number }) => {
        try {
            const url = `http://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            const json = await response.json();

            if (json.routes && json.routes.length > 0) {
                const geometry = json.routes[0].geometry;
                // Geometry is GeoJSON LineString [ [lon, lat], ... ]
                const coords = geometry.coordinates.map((c: number[]) => ({
                    latitude: c[1],
                    longitude: c[0],
                }));
                setRouteCoords(coords);
            }
        } catch (err) {
            console.log('Route error', err);
        }
    };

    const centerOnUser = () => {
        if (userLocation) {
            mapRef.current?.animateToRegion({
                ...userLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search Location..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                onSubmitEditing={handleSearch}
                style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
                loading={loading}
            />

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT} // Use default/legacy provider then add UrlTile
                initialRegion={region}
                mapType="none" // Hide default Google tiles if possible, or overlay
            // On Android "none" might show nothing, "standard" shows Google.
            // We use UrlTile to overlay OSM. 
            >
                <UrlTile
                    urlTemplate={OSM_TEMPLATE}
                    maximumZ={19}
                    flipY={false}
                />

                {userLocation && (
                    <Marker coordinate={userLocation} title="You">
                        <View style={[styles.userMarker, { backgroundColor: theme.colors.primary }]} />
                    </Marker>
                )}

                {destination && (
                    <Marker coordinate={destination} pinColor={theme.colors.error} />
                )}

                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor={theme.colors.primary}
                        strokeWidth={4}
                    />
                )}
            </MapView>

            <FAB
                icon="crosshairs-gps"
                style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
                onPress={centerOnUser}
            />

            <FAB
                icon="cog"
                small
                style={[styles.settingsFab, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('Settings')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    searchbar: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        zIndex: 10,
        borderRadius: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    settingsFab: {
        position: 'absolute',
        margin: 16,
        left: 0,
        bottom: 0,
    },
    userMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
});
