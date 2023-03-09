import type {
  LatLng,
  LatLngBoundsLiteral,
  LatLngExpression,
  LatLngLiteral,
  Map as LeafletMap,
} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, {useEffect, useState} from 'react';
import {
  ImageOverlay,
  ImageOverlayProps,
  LayersControl,
  MapContainer,
  TileLayer,
  TileLayerProps,
  WMSTileLayer,
  WMSTileLayerProps,
} from 'react-leaflet';
import Measure from 'react-measure';
import './styles/markers.css';
import {ExpoLeafletProps} from './Leaflet.types';
import {MapMarkers} from './MapMarkers';
import {MapShapes} from './MapShapes';
import {MapLayer} from './model';
import EventHandle from './EventHandle';

const {BaseLayer} = LayersControl;

interface MapLayersProps {
  mapLayers: Array<MapLayer>;
}

const Layer = (props: MapLayer): JSX.Element => {
  switch (props.layerType) {
    case 'ImageOverlay':
      return <ImageOverlay {...(props as ImageOverlayProps)} />;
    case 'WMSTileLayer':
      return <WMSTileLayer {...(props as WMSTileLayerProps)} />;
    default:
      return <TileLayer {...(props as TileLayerProps)} />;
  }
};

const MapLayers = (props: MapLayersProps) => {
  const {mapLayers} = props;
  const Wrap = mapLayers.length > 1 ? LayersControl : React.Fragment;
  return (
    <Wrap>
      {mapLayers.map((layer: MapLayer, index: number): JSX.Element => {
        if (layer.baseLayerName && mapLayers.length > 1) {
          return (
            <BaseLayer
              key={`layer-${index}`}
              checked={layer.baseLayerIsChecked || false}
              name={layer.baseLayerName || `Layer.${index}`}>
              <Layer {...layer} />
            </BaseLayer>
          );
        } else {
          return <Layer key={`layer-${index}`} {...layer} />;
        }
      })}
    </Wrap>
  );
};

const toLatLngLiteral = (latLng: LatLng): LatLngLiteral => {
  return {
    lat: latLng?.lat,
    lng: latLng?.lng,
  };
};

const bounds = (map?: LeafletMap | null): LatLngBoundsLiteral => {
  const bound = map?.getBounds()!;
  const northEast = bound?.getNorthEast();
  const southWest = bound?.getSouthWest();
  return [
    [northEast?.lat, northEast?.lng],
    [southWest?.lat, southWest?.lng],
  ];
};

const center = (map?: LeafletMap | null): LatLngLiteral => {
  return toLatLngLiteral(map?.getCenter()!);
};

export const MapComponent = (props: ExpoLeafletProps) => {
  const {
    mapCenterPosition,
    mapLayers = [],
    mapMarkers = [],
    mapShapes = [],
    onMessage,
    zoom = 13,
    maxZoom = 20,
    minZoom = 11,
  } = props;
  const [dimensions, setDimensions] = useState({height: 0, width: 0});
  // const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  // useEffect(() => {
  //   if (props.mapCenterPosition || props.zoom) {
  //     props.onMessage({
  //       tag: "DebugMessage",
  //       message: `Flying to ${props.mapCenterPosition.lat},${props.mapCenterPosition.lng} ${props.zoom}`,
  //     });
  //     mapRef?.flyTo(
  //       [props.mapCenterPosition.lat, props.mapCenterPosition.lng],
  //       props.zoom
  //     );
  //   }
  // }, [props.mapCenterPosition?.lat, props.mapCenterPosition?.lng, props.zoom]);
  return (
    <Measure
      bounds
      onResize={contentRect => {
        if (contentRect.bounds) {
          const {height, width} = contentRect.bounds;
          setDimensions({height, width});
        }
      }}>
      {({measureRef}) => (
        <div
          ref={measureRef}
          id="map-container"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            backgroundColor: props.backgroundColor,
            left: 0,
            right: 0,
          }}>
          {dimensions.height > 0 && (
            <MapContainer
              {...props.mapOptions}
              whenReady={() => {
                // setMapRef(map);

                onMessage({tag: 'MapReady', version: '1.0.2'});
              }}
              center={mapCenterPosition as LatLngExpression}
              maxZoom={maxZoom}
              minZoom={minZoom}
              zoom={zoom}
              style={{width: '100%', height: dimensions.height}}>
              <EventHandle
                onMessage={onMessage}
                toLatLngLiteral={toLatLngLiteral}
                bounds={bounds}
                center={center}
              />
              <MapLayers mapLayers={mapLayers} />
              <MapMarkers
                mapMarkers={mapMarkers}
                onClick={mapMarkerId => {
                  onMessage({
                    tag: 'onMapMarkerClicked',
                    mapMarkerId,
                  });
                }}
              />
              <MapShapes mapShapes={mapShapes} />
            </MapContainer>
          )}
        </div>
      )}
    </Measure>
  );
};
