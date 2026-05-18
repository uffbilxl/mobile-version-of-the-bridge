import { useEffect, useMemo, useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { Laptop, Tablet, Wifi, Smartphone } from "lucide-react";
import { useBridgeStore } from "@/store/useBridgeStore";
import { BRIDGE_MAP_ID, DARK_MAP_STYLES, GOOGLE_MAPS_API_KEY } from "@/lib/mapsConfig";
import type { Device } from "@/lib/mockData";

const ICONS = { Laptop, Tablet, Broadband: Wifi, Mobile: Smartphone } as const;

interface Props {
  devices: Device[];
  onRequest: (d: Device) => void;
}

export function DeviceMap({ devices, onRequest }: Props) {
  const centre = useMemo(() => {
    // Default to BCU Curzon Building, Birmingham
    if (!devices.length) return { lat: 52.4830, lng: -1.8920 };
    const lat = devices.reduce((s, d) => s + d.lat, 0) / devices.length;
    const lng = devices.reduce((s, d) => s + d.lng, 0) / devices.length;
    return { lat, lng };
  }, [devices]);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-[260px] w-full overflow-hidden rounded-xl border border-card-border lg:h-[380px]">
        <Map
          defaultZoom={14}
          defaultCenter={centre}
          mapId={BRIDGE_MAP_ID}
          tilt={60}
          heading={20}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl
          zoomControl
          styles={DARK_MAP_STYLES as unknown as never}
          style={{ width: "100%", height: "100%" }}
        >
          <MapInner devices={devices} centre={centre} onRequest={onRequest} />
        </Map>
      </div>
    </APIProvider>
  );
}

function MapInner({
  devices,
  centre,
  onRequest,
}: {
  devices: Device[];
  centre: { lat: number; lng: number };
  onRequest: (d: Device) => void;
}) {
  const map = useMap();
  const { activeDeviceId, setActiveDeviceId } = useBridgeStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (map) map.panTo(centre);
  }, [map, centre.lat, centre.lng]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 4000 },
    );
  }, []);

  return (
    <>
      {devices.map((d) => {
        const Icon = ICONS[d.category];
        const active = activeDeviceId === d.id;
        return (
          <AdvancedMarker
            key={d.id}
            position={{ lat: d.lat, lng: d.lng }}
            onClick={() => {
              setOpenId(d.id);
              setActiveDeviceId(d.id);
              const el = document.getElementById(`device-card-${d.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            <div
              onMouseEnter={() => setActiveDeviceId(d.id)}
              onMouseLeave={() => setActiveDeviceId(null)}
              style={{
                transform: active ? "scale(1.15)" : "scale(1)",
                transition: "transform 200ms ease, filter 200ms ease",
                filter: active
                  ? "drop-shadow(0 6px 10px rgba(123,94,167,0.7))"
                  : "drop-shadow(0 4px 6px rgba(0,0,0,0.45))",
                animation: "bridge-pin-drop 600ms cubic-bezier(0.34,1.56,0.64,1) both",
              }}
              className="relative flex h-10 w-8 items-end justify-center"
            >
              {/* Teardrop pin */}
              <svg
                viewBox="0 0 32 44"
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`pin-grad-${d.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9B7BC9" />
                    <stop offset="100%" stopColor="#4A90D9" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 0C7.2 0 0 7 0 15.6 0 27 16 44 16 44s16-17 16-28.4C32 7 24.8 0 16 0z"
                  fill={`url(#pin-grad-${d.id})`}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle cx="16" cy="15" r="7" fill="white" />
              </svg>
              <Icon className="relative z-10 h-3.5 w-3.5 text-[#4A90D9] mb-[22px]" />
            </div>
            {openId === d.id && (
              <InfoWindow position={{ lat: d.lat, lng: d.lng }} onCloseClick={() => setOpenId(null)}>
                <div style={{ color: "#030712", minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: "#475569", margin: "2px 0 6px" }}>
                    {d.availability_type}
                    {d.distance_miles != null ? ` · ${d.distance_miles} mi` : ""}
                  </div>
                  <button
                    onClick={() => {
                      setOpenId(null);
                      onRequest(d);
                    }}
                    style={{
                      background: "linear-gradient(135deg,#7B5EA7,#4A90D9)",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    Request this
                  </button>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        );
      })}

      {userPos && (
        <AdvancedMarker position={userPos}>
          <div className="relative">
            <div className="h-2.5 w-2.5 rounded-full bg-[#4A90D9] ring-2 ring-white" />
            <div className="absolute inset-0 -m-1 animate-ping rounded-full bg-[#4A90D9]/60" />
          </div>
        </AdvancedMarker>
      )}
    </>
  );
}