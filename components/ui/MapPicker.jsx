"use client";

import { lazy, Suspense } from "react";

const MapPickerInner = lazy(() => import("./MapPickerInner"));

const MapPicker = (props) => (
  <Suspense fallback={<div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>}>
    <MapPickerInner {...props} />
  </Suspense>
);

export default MapPicker;
