import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Loader } from 'lucide-react';
import Layout from '@/components/Layout';
import PlaceCard from '@/components/PlaceCard';
import { supabase, Place } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { i18n, t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [phnomPenhDistances, setPhnomPenhDistances] = useState<Record<string, number>>({});
  const [provinces, setProvinces] = useState<Set<string>>(new Set());

  // Phnom Penh coordinates as fallback
  const PHNOM_PENH = { lat: 11.5564, lng: 104.9282 };

  const isKhmer = i18n.language === 'km';

  // Request geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // User denied permission
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Fetch places from Supabase
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const placesData = (data || []) as Place[];
        setPlaces(placesData);

        // Extract unique provinces
        const uniqueProvinces = new Set<string>();
        placesData.forEach((place) => {
          const province = isKhmer ? place.province_km : place.province_en;
          uniqueProvinces.add(province);
        });
        setProvinces(uniqueProvinces);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [isKhmer]);

  // Calculate distances when user location changes or on initial load
  useEffect(() => {
    if (places.length === 0) return;

    const calculateDistances = async () => {
      const newDistances: Record<string, number> = {};
      const newPhnomPenhDistances: Record<string, number> = {};
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.warn('Google Maps API key not configured');
        return;
      }

      for (const place of places) {
        if (!place.coordinates) continue;

        try {
          // Calculate from user location if available
          if (userLocation) {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.lat},${userLocation.lng}&destination=${place.coordinates.lat},${place.coordinates.lng}&key=${apiKey}`
            );
            const data = await response.json();

            if (
              data.routes &&
              data.routes[0] &&
              data.routes[0].legs[0]
            ) {
              const distanceText = data.routes[0].legs[0].distance.text;
              const distanceValue = parseInt(
                distanceText.replace(/[^\d]/g, '')
              );
              newDistances[place.id] = distanceValue;
            }
          }

          // Always calculate from Phnom Penh as fallback
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${PHNOM_PENH.lat},${PHNOM_PENH.lng}&destination=${place.coordinates.lat},${place.coordinates.lng}&key=${apiKey}`
          );
          const data = await response.json();

          if (
            data.routes &&
            data.routes[0] &&
            data.routes[0].legs[0]
          ) {
            const distanceText = data.routes[0].legs[0].distance.text;
            const distanceValue = parseInt(
              distanceText.replace(/[^\d]/g, '')
            );
            newPhnomPenhDistances[place.id] = distanceValue;
          }
        } catch (error) {
          console.error(`Error calculating distance for place ${place.id}:`, error);
        }
      }

      setDistances(newDistances);
      setPhnomPenhDistances(newPhnomPenhDistances);
    };

    calculateDistances();
  }, [userLocation, places]);

  // Filter places based on search criteria
  useEffect(() => {
    let filtered = places;

    // Filter by search text (name/province)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((place) => {
        const name = isKhmer ? place.name_km : place.name_en;
        const province = isKhmer ? place.province_km : place.province_en;
        return (
          name.toLowerCase().includes(searchLower) ||
          province.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by province
    if (selectedProvince !== 'all') {
      filtered = filtered.filter((place) => {
        const province = isKhmer ? place.province_km : place.province_en;
        return province === selectedProvince;
      });
    }

    // Filter by keywords
    if (searchKeywords.trim()) {
      const keywordsLower = searchKeywords.toLowerCase();
      filtered = filtered.filter((place) =>
        place.keywords.some((kw) =>
          kw.toLowerCase().includes(keywordsLower)
        )
      );
    }

    setFilteredPlaces(filtered);
  }, [searchText, selectedProvince, searchKeywords, places, isKhmer]);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-secondary/5">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('search')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isKhmer
                ? 'ស្វាគមន៍មកកាន់ប្រទេសកម្ពុជា។ ស្វាយលាក់ដើម្បីរកឃើញកន្លែងទេសចរណ៍ដ៏ស្អាត'
                : 'Explore the beautiful destinations across Cambodia. Search to discover amazing places.'}
            </p>
          </div>

          {/* Search Filters */}
          <div className="space-y-4 mb-8">
            {/* Search by Name/Province */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Province Select */}
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('selectProvince')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allProvinces')}</SelectItem>
                  {Array.from(provinces).sort().map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Keywords Search */}
              <Input
                type="text"
                placeholder={t('searchByKeywords')}
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Location Permission */}
          {!userLocation && (
            <div className="mb-8 p-4 bg-secondary/10 border border-secondary/20 rounded-lg flex items-start gap-3">
              <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-secondary mb-2">
                  {t('enableLocation')}
                </p>
                <Button
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setUserLocation({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        });
                      }
                    );
                  }}
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  {t('enableLocation')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="container mx-auto px-4 pb-12">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">{isKhmer ? 'កំពុងផ្ទុក...' : 'Loading places...'}</p>
              </div>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {isKhmer ? 'មិនមានលទ្ធផលស្វាយលាក់' : 'No places found'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {isKhmer ? `បានរកឃើញ ${filteredPlaces.length} កន្លែង` : `Found ${filteredPlaces.length} places`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    userLocation={userLocation || undefined}
                    distance={distances[place.id]}
                    phnomPenhDistance={phnomPenhDistances[place.id]}
                    showingPhnomPenhDistance={!userLocation}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
