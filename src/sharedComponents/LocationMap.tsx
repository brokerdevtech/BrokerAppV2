import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
const {width, height} = Dimensions.get('window');
const LocationMap = ({locationData}) => {
  const mapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const initialRegion = {
    latitude: locationData.geoLocationLatitude,
    longitude: locationData.geoLocationLongitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  useEffect(() => {
    if (isMapReady && mapRef.current) {
      // Perform any actions that depend on map dimensions here
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: locationData.viewportNorthEastLat,
            longitude: locationData.viewportNorthEastLng,
          },
          {
            latitude: locationData.viewportSouthWestLat,
            longitude: locationData.viewportSouthWestLng,
          },
        ],
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        },
      );
    }
  }, [isMapReady]);

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  return (
    <View style={styles.container} onLayout={handleMapReady}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onMapReady={handleMapReady}
          scrollEnabled={false} // Disables dragging
          pitchEnabled={false} // Disables tilt
          rotateEnabled={false} // Disables rotation
          zoomEnabled={false} // Keeps zoom enabled if needed
        >
          <Marker
            coordinate={{
              latitude: locationData.geoLocationLatitude,
              longitude: locationData.geoLocationLongitude,
            }}
            title={locationData.placeName}
            description={`${locationData?.cityName}, ${locationData?.stateName}, ${locationData?.countryName}`}
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15, // Apply rounded corners here
    overflow: 'hidden', // Ensure content is clipped to rounded corners
  },
  map: {
    flex: 1,
    justifyContent: 'center',
    height: 300,
    width: width - 40,
    borderRadius: 8,
  },
});

export default LocationMap;
