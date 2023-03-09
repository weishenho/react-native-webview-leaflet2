import React, {useEffect, useState} from 'react';
import {LeafletMapProps} from './Leaflet.types';
import {MapComponent} from './MapComponent';
import {LeafletWebViewEvent} from './model';
import './styles/index.css';

const sendMessage = (message: LeafletWebViewEvent) => {
  // @ts-ignore
  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
};

const sendDebugMessage = (message: string) => {
  sendMessage({tag: 'DebugMessage', message});
};

export const NativeHarness = () => {
  const [state, setState] = useState<Partial<LeafletMapProps>>({
    mapCenterPosition: {lat: 1.358479, lng: 103.815201},
    mapLayers: [
      {
        baseLayer: true,
        url: 'https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png',
        id: 'onemapbase',
        zIndex: 1,
      },
    ],
    mapMarkers: [
      {
        id: 'p1',
        position: {lat: 1.3193806546308717, lng: 103.895170723806},
        icon: '📍',
        size: [24, 24],
      },
      {
        id: 'p2',
        position: {lat: 1.319265898527754, lng: 103.89446349064242},
        icon: '📍',
        size: [24, 24],
      },
      {
        id: 'p3',
        position: {lat: 1.3189660519107513, lng: 103.89402656125338},
        icon: '📍',
        size: [24, 24],
      },
      {
        id: 'p4',
        position: {lat: 1.3187291360396711, lng: 103.89463752183975},
        icon: '📍',
        size: [24, 24],
      },
      {
        id: 'p5',
        position: {lat: 1.3190511935464035, lng: 103.89521515730318},
        icon: '📍',
        size: [24, 24],
      },
    ],
    mapShapes: [],
    maxZoom: 18,
    minZoom: 11,
    zoom: 13,
  });

  useEffect(() => {
    const handleNativeMessage = (event: MessageEvent) => {
      try {
        const eventData = event.data as LeafletMapProps;
        if (Object.keys(eventData).length === 0) {
          return;
        }
        setState(state => ({...state, ...eventData}));
      } catch (error) {
        sendDebugMessage(JSON.stringify(error));
      }
    };
    if (window) {
      window.addEventListener('message', handleNativeMessage);
      sendMessage({
        tag: 'MapComponentMounted',
        version: '0.1',
      });
    } else {
      sendMessage({
        tag: 'Error',
        error: 'Unable to add window / document event listeners',
      });
    }
    return () => {
      if (window) {
        window.removeEventListener('message', handleNativeMessage);
      }
    };
  }, []);

  // If we haven't received the first message from the parent,
  // dont render yet since some options can't be changed after the first render.
  if (
    state.mapCenterPosition == null ||
    state.mapLayers == null ||
    state.mapLayers.length === 0
  ) {
    return null;
  }
  return (
    <MapComponent
      mapCenterPosition={state.mapCenterPosition}
      mapLayers={state.mapLayers}
      mapMarkers={state.mapMarkers}
      mapOptions={state.mapOptions}
      mapShapes={state.mapShapes}
      maxZoom={state.maxZoom}
      minZoom={state.minZoom}
      zoom={state.zoom}
      onMessage={(webViewLeafletEvent: LeafletWebViewEvent) => {
        sendMessage(webViewLeafletEvent);
      }}
    />
  );
};
