import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HiArrowRight, HiOutlineMap, HiOutlineUserGroup, HiOutlineGlobeAlt, HiOutlineClock } from "react-icons/hi";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Matches the site's actual seeded/planned dealer cities
const CITIES = [
  { name: "Kathmandu", lat: 27.7172, lng: 85.324 },
  { name: "Pokhara", lat: 28.2096, lng: 83.9856 },
  { name: "Chitwan", lat: 27.5291, lng: 84.3542 },
  { name: "Butwal", lat: 27.7, lng: 83.4485 },
  { name: "Biratnagar", lat: 26.4525, lng: 87.2718 },
];

const INFO = [
  { icon: HiOutlineMap, label: "Multiple Regions" },
  { icon: HiOutlineUserGroup, label: "Growing Dealer Network" },
  { icon: HiOutlineGlobeAlt, label: "Nationwide Coverage" },
  { icon: HiOutlineClock, label: "Dedicated Support" },
];

export default function NepalDealerNetwork() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-[#17699A] text-xs font-bold uppercase tracking-wider">
            Nationwide Presence
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0D2947] mt-2">
            Our dealer network across Nepal
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 rounded-2xl overflow-hidden border border-[#DCE6EF] h-[420px]">
            <MapContainer
              center={[27.6, 84.7]}
              zoom={7}
              minZoom={7}
              maxZoom={11}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {CITIES.map((city) => (
                <Marker key={city.name} position={[city.lat, city.lng]} icon={markerIcon}>
                  <Popup>{city.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {INFO.map((item) => (
                <div key={item.label} className="bg-[#F7FAFD] rounded-xl p-4">
                  <item.icon className="text-[#17699A] text-lg mb-2" aria-hidden="true" />
                  <p className="text-xs font-semibold text-[#0D2947] leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/dealers"
              className="text-sm font-semibold text-[#17699A] hover:text-[#0D2947] transition-colors flex items-center gap-1"
            >
              View all dealers <HiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
