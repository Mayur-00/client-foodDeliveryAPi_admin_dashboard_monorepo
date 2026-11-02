"use client"

import { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const getAssetUrl = (asset: string | { src: string }) =>
  typeof asset === 'string' ? asset : asset.src;

interface LiveTrackerProps {
  destinationCoords: [number, number]; // [Latitude, Longitude]
}

export default function LiveTracker({ destinationCoords }: LiveTrackerProps) {
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Leaflet.Map | null>(null);
  const routingControlRef = useRef<Leaflet.Control | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    // Watch position continuously as you move
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords([latitude, longitude]);
        setGpsError(null);
      },
      (error: GeolocationPositionError) => {
        console.error(error);
        setGpsError('Unable to retrieve your location. Please check GPS/permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Cleanup watcher on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      const leafletModule = await import('leaflet');
      await import('leaflet-routing-machine');

      if (cancelled || !mapRef.current) return;

      const L = leafletModule.default;
      const defaultIcon = L.icon({
        iconUrl: getAssetUrl(icon),
        shadowUrl: getAssetUrl(iconShadow),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      mapInstanceRef.current = L.map(mapRef.current).setView(destinationCoords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
      L.Marker.prototype.options.icon = defaultIcon;
      setMapError(null);
      setMapReady(true);
    };

    void initializeMap().catch((error: unknown) => {
      console.error('Unable to initialize the live map', error);
      if (!cancelled) {
        setMapError('Unable to load the map. Please try again.');
      }
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      routingControlRef.current = null;
      setMapReady(false);
    };
  }, [destinationCoords[0], destinationCoords[1]]);

  useEffect(() => {
    if (!mapReady || !currentCoords) return;
    let cancelled = false;

    const updateRoute = async () => {
      const leafletModule = await import('leaflet');
      await import('leaflet-routing-machine');

      const map = mapInstanceRef.current;
      if (cancelled || !map) return;
      const L = leafletModule.default;

      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      type RoutingControlOptions = {
        waypoints: [Leaflet.LatLng, Leaflet.LatLng];
        routeWhileDragging: boolean;
        showAlternatives: boolean;
        fitSelectedRoutes: boolean;
        lineOptions: { styles: { color: string; weight: number; opacity: number }[] };
        createMarker: (index: number, waypoint: { latLng: Leaflet.LatLng }) => Leaflet.Marker;
      };
      const routing = (L as typeof L & {
        Routing: { control: (options: RoutingControlOptions) => Leaflet.Control };
      }).Routing;

      const markerIcon = L.icon({
        iconUrl: getAssetUrl(icon),
        shadowUrl: getAssetUrl(iconShadow),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      routingControlRef.current = routing.control({
        waypoints: [
          L.latLng(currentCoords[0], currentCoords[1]),
          L.latLng(destinationCoords[0], destinationCoords[1])
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        lineOptions: {
          styles: [{ color: '#2563eb', weight: 6, opacity: 0.8 }]
        },
        createMarker: (index, waypoint) => {
          const label = index === 0 ? 'You Are Here (Live)' : 'Destination';
          return L.marker(waypoint.latLng, { icon: markerIcon }).bindPopup(label);
        }
      }).addTo(map);
    };

    void updateRoute().catch((error: unknown) => {
      console.error('Unable to update the live route', error);
      if (!cancelled) {
        setMapError('Unable to calculate the route. Please try again.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentCoords, destinationCoords, mapReady]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Live GPS Map Tracking (TypeScript)</h2>

      {gpsError && <p style={{ color: 'red', fontWeight: 'bold' }}>{gpsError}</p>}
      {mapError && <p style={{ color: 'red', fontWeight: 'bold' }}>{mapError}</p>}

      {!currentCoords && !gpsError && (
        <p style={{ color: '#555' }}>Acquiring your live GPS position...</p>
      )}

      <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', marginTop: '15px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}