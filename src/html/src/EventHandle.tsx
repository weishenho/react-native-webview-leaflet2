import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LeafletWebViewEvent } from "./model";
import type {
  LatLng,
  LatLngBoundsLiteral,
  LatLngLiteral,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet";
type Props = {
  onMessage: (message: LeafletWebViewEvent) => void;
  toLatLngLiteral: (latLng: LatLng) => LatLngLiteral;
  bounds: (map?: LeafletMap | null) => LatLngBoundsLiteral;
  center: (map?: LeafletMap | null) => LatLngLiteral;
};

const EventHandle = ({
  onMessage,
  toLatLngLiteral,
  bounds,
  center,
}: Props): null => {
  const map = useMap();

  useEffect(() => {
    map.addEventListener({
      click: (event: LeafletMouseEvent) => {
        const { latlng } = event;
        onMessage({
          tag: "onMapClicked",
          location: toLatLngLiteral(latlng),
        });
      },
      move: () => {
        onMessage({
          tag: "onMove",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map.getZoom()!,
        });
      },
      moveend: () => {
        onMessage({
          tag: "onMoveEnd",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map.getZoom()!,
        });
      },
      movestart: () => {
        onMessage({
          tag: "onMoveStart",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map.getZoom()!,
        });
      },
      resize: () => {
        onMessage({
          tag: "onResize",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map?.getZoom()!,
        });
      },
      unload: () => {
        onMessage({
          tag: "onUnload",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map?.getZoom()!,
        });
      },
      zoom: () => {
        onMessage({
          tag: "onZoom",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map?.getZoom()!,
        });
      },
      zoomend: () => {
        onMessage({
          tag: "onZoomEnd",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map?.getZoom()!,
        });
      },
      zoomlevelschange: () => {
        onMessage({
          tag: "onZoomLevelsChange",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map?.getZoom()!,
        });
      },
      zoomstart: () => {
        onMessage({
          tag: "onZoomStart",
          bounds: bounds(map),
          mapCenter: center(map),
          zoom: map?.getZoom()!,
        });
      },
    });
    return () => {
      map.clearAllEventListeners();
    };
  }, [map]);

  //   const mapEvents = useMapEvents({
  //     click: (event: LeafletMouseEvent) => {
  //       const { latlng } = event;
  //       onMessage({
  //         tag: "onMapClicked",
  //         location: toLatLngLiteral(latlng),
  //       });
  //     },
  //     move: () => {
  //       onMessage({
  //         tag: "onMove",
  //         bounds: bounds(map),
  //         mapCenter: center(map),
  //         zoom: map.getZoom()!,
  //       });
  //     },
  //     // moveend: () => {
  //     //   onMessage({
  //     //     tag: "onMoveEnd",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map.getZoom()!,
  //     //   });
  //     // },
  //     // movestart: () => {
  //     //   onMessage({
  //     //     tag: "onMoveStart",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map.getZoom()!,
  //     //   });
  //     // },
  //     // resize: () => {
  //     //   onMessage({
  //     //     tag: "onResize",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map?.getZoom()!,
  //     //   });
  //     // },
  //     // unload: () => {
  //     //   onMessage({
  //     //     tag: "onUnload",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map?.getZoom()!,
  //     //   });
  //     // },
  //     // zoom: () => {
  //     //   onMessage({
  //     //     tag: "onZoom",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map?.getZoom()!,
  //     //   });
  //     // },
  //     // zoomend: () => {
  //     //   onMessage({
  //     //     tag: "onZoomEnd",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map?.getZoom()!,
  //     //   });
  //     // },
  //     // zoomlevelschange: () => {
  //     //   onMessage({
  //     //     tag: "onZoomLevelsChange",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map?.getZoom()!,
  //     //   });
  //     // },
  //     // zoomstart: () => {
  //     //   onMessage({
  //     //     tag: "onZoomStart",
  //     //     bounds: bounds(map),
  //     //     mapCenter: center(map),
  //     //     zoom: map?.getZoom()!,
  //     //   });
  //     // },
  //   });
  return null;
};

export default EventHandle;
