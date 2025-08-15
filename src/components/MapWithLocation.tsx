import {MapContainer, Marker, TileLayer, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useEffect, useState} from 'react';
import '../styles/MapWithLocation.css'

// Фикс для иконок
L.Marker.prototype.options.icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function LocationMarker() {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate({
            setView: true,
            maxZoom: 15,
            timeout: 10000
        }).on('locationfound', (e) => {
            setPosition([e.latlng.lat, e.latlng.lng]);
        });
    }, [map]);

    return position ? <Marker position={position}/> : null;
}

export default function MapWithLocation() {
    return (
        <MapContainer
            center={[55.751244, 37.618423]}
            zoom={13}
            className="map-container"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
            />
            <LocationMarker/>
        </MapContainer>
    );
}