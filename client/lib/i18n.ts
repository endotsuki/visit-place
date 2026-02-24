import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  km: {
    translation: {
      home: "ទំព័រដើម",
      search: "ស្វាគមន៍ទៅកាន់ កម្ពុជា",
      searchPlaceholder: "ស្វែងរកដោយឈ្មោះកន្លែង ឬ ខេត្ត...",
      searchByKeywords: "ស្វែងរកដោយពាក្យគន្លឹះ...",
      selectProvince: "ជ្រើសរើសខេត្ត",
      allProvinces: "ខេត្តទាំងអស់",
      distance: "ចម្ងាយ",
      location: "ទីតាំង",
      images: "រូបភាព",
      openInMaps: "បើកក្នុង Google Maps",
      enableLocation: "សូមបើកការអនុញ្ញាតទីតាំង ដើម្បីមើលចម្ងាយ",
      km: "គ.ម",
      admin: "អ្នកគ្រប់គ្រង",
      addPlace: "បន្ថែមកន្លែង",
      editPlace: "កែប្រែកន្លែង",
      deletePlace: "លុបកន្លែង",
      save: "រក្សាទុក",
      cancel: "បោះបង់",
      delete: "លុប",
      upload: "ផ្ទុកឡើង",
      khmer: "ខ្មែរ",
      english: "English",
    },
  },
  en: {
    translation: {
      home: "Home",
      search: "Discover Cambodia",
      searchPlaceholder: "Search by place name or province...",
      searchByKeywords: "Search by keywords...",
      selectProvince: "Select Province",
      allProvinces: "All Provinces",
      distance: "Distance",
      location: "Location",
      images: "Images",
      openInMaps: "Open in Google Maps",
      enableLocation: "Please enable location access to see distances",
      km: "km",
      admin: "Admin",
      addPlace: "Add Place",
      editPlace: "Edit Place",
      deletePlace: "Delete Place",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      upload: "Upload",
      khmer: "ខ្មែរ",
      english: "English",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "km",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
