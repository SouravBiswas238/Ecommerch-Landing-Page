"use client";

import dynamic from "next/dynamic";

// Leaflet is browser-only — must be loaded with ssr: false
const MapPickerInner = dynamic(() => import("./MapPickerInner"), { ssr: false });

const MapPicker = (props) => <MapPickerInner {...props} />;

export default MapPicker;
