// mobile/screens/MapScreen.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { LocationContext } from '../context/LocationContext';
import theme from '../theme';

const OWM_API_KEY = 'f1fe4c74e11e37a0d0d35c72f593e300';

export default function MapScreen() {
  const { coords } = useContext(LocationContext);
  const mapRef = useRef(null);

  useEffect(() => {
    if (coords && mapRef.current) {
      const region = {
        latitude:      coords.lat,
        longitude:     coords.lon,
        latitudeDelta:  1.5,
        longitudeDelta: 1.5,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [coords]);

  if (!coords) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>
          Search for a city first to see its climate map.
        </Text>
      </View>
    );
  }

  const { lat, lon } = coords;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude:      lat,
        longitude:     lon,
        latitudeDelta:  1.5,
        longitudeDelta: 1.5,
      }}
    >
      <Marker coordinate={{ latitude: lat, longitude: lon }} />

      <UrlTile
        urlTemplate={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`}
        zIndex={1}
        maximumZ={14}
        flipY={false}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  msg: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    textAlign: 'center',
  },
});
