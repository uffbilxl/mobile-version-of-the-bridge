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
    if (!devices.length) return { lat: 53.4808, lng: -2.2426 };
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
          styles={DARK_MAP_STYLES as unknown as google.maps.MapTypeStyle[]}
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
                transform: active ? "scale(1.3)" : "scale(1)",
                transition: "transform 200ms ease, filter 200ms ease",
                filter: active ? "drop-shadow(0 0 12px #7B5EA7)" : "none",
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7B5EA7] text-white ring-2 ring-white/30"
            >
              <Icon className="h-4 w-4" />
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