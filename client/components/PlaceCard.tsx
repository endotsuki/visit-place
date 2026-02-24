import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, MapPin, Navigation } from "lucide-react";
import { Place } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface PlaceCardProps {
  place: Place;
  userLocation?: { lat: number; lng: number };
  distance?: number;
  phnomPenhDistance?: number;
  showingPhnomPenhDistance?: boolean;
}

export default function PlaceCard({
  place,
  distance,
  phnomPenhDistance,
  showingPhnomPenhDistance,
}: PlaceCardProps) {
  const { i18n, t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isKhmer = i18n.language === "km";
  const name = isKhmer ? place.name_km : place.name_en;
  const province = isKhmer ? place.province_km : place.province_en;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (place.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (place.images?.length || 1)) % (place.images?.length || 1),
    );
  };

  const handleOpenMaps = () => {
    window.open(place.map_link, "_blank");
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Image Container */}
      <div className="relative h-56 bg-muted overflow-hidden">
        {place.images && place.images.length > 0 ? (
          <>
            <img
              src={place.images[currentImageIndex]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {place.images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1} / {place.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Province */}
        <div>
          <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">
            {name}
          </h3>
          <p className="text-sm text-secondary font-semibold">{province}</p>
        </div>

        {/* Distance */}
        {distance !== undefined ? (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Navigation className="h-4 w-4" />
            <span>
              {distance.toFixed(1)} {t("km")}
            </span>
          </div>
        ) : showingPhnomPenhDistance && phnomPenhDistance !== undefined ? (
          <div className="flex items-center gap-2 text-sm font-medium text-secondary">
            <Navigation className="h-4 w-4" />
            <span className="text-xs">
              From Phnom Penh: {phnomPenhDistance.toFixed(1)} {t("km")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic">
            {t("enableLocation")}
          </div>
        )}

        {/* Open Maps Button */}
        <Button
          onClick={handleOpenMaps}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {t("openInMaps")}
        </Button>
      </div>
    </div>
  );
}
