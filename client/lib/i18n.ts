import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  km: {
    translation: {
      home: 'ទំព័រដើម',
      search: 'ស្វាគមន៍ទៅកាន់ កម្ពុជា',
      searchPlaceholder: 'ស្វែងរកតាមឈ្មោះកន្លែង ឬ ខេត្ត...',
      searchByName: 'ស្វែងរកតាមឈ្មោះ ឬខេត្ត…',
      selectProvince: 'ជ្រើសរើសខេត្ត',
      allProvinces: 'ខេត្តទាំងអស់',
      filters: 'តម្រង',
      clearAllFilters: 'លុបតម្រងទាំងអស់',
      clearFilters: 'លុបតម្រង',
      aboutThisPlace: 'អំពីទីតាំងនេះ',
      tags: 'ស្លាក',
      loadingDestinations: 'កំពុងផ្ទុក…',
      noPlacesFound: 'មិនមានលទ្ធផល',
      tryAdjustSearch: 'សូមព្យាយាមស្វែងរកម្តងទៀត',
      destination: 'កន្លែង',
      distance: 'ចម្ងាយ',
      location: 'ទីតាំង',
      images: 'រូបភាព',
      openInMaps: 'បើកក្នុង Google Maps',
      km: 'គ.ម',
      fromPP: 'ពី ភ្នំពេញ',
      placeNotFound: 'រកមិនឃើញកន្លែង',
      all: 'ទាំងអស់',
      admin: 'អ្នកគ្រប់គ្រង',
      addPlace: 'បន្ថែមកន្លែង',
      editPlace: 'កែប្រែកន្លែង',
      deletePlace: 'លុបកន្លែង',
      save: 'រក្សាទុក',
      cancel: 'បោះបង់',
      delete: 'លុប',
      areYouSureDelete: 'តើអ្នកពិតជាចង់លុបឬ?',
      upload: 'ផ្ទុកឡើង',
      khmer: 'ខ្មែរ',
      english: 'English',
      heroSubtitle: 'ស្វាគមន៍មកកាន់ប្រទេសកម្ពុជា។ ស្វែងរកដើម្បីរកឃើញកន្លែងទេសចរណ៍ដ៏ស្អាត',
    },
  },
  en: {
    translation: {
      home: 'Home',
      search: 'Discover Cambodia',
      searchPlaceholder: 'Search by place name or province...',
      searchByName: 'Search by name or province…',
      selectProvince: 'Select Province',
      allProvinces: 'All Provinces',
      filters: 'Filters',
      all: 'All',
      clearAllFilters: 'Clear all filters',
      clearFilters: 'Clear filters',
      loadingDestinations: 'Loading destinations…',
      noPlacesFound: 'No places found',
      tryAdjustSearch: 'Try adjusting your search or clearing filters',
      destination: 'destination',
      distance: 'Distance',
      location: 'Location',
      images: 'Images',
      aboutThisPlace: 'About this place',
      tags: 'Tags',
      openInMaps: 'Open in Google Maps',
      km: 'km',
      fromPP: 'from Phnom Penh',
      placeNotFound: 'Place not found',
      admin: 'Admin',
      addPlace: 'Add Place',
      editPlace: 'Edit Place',
      deletePlace: 'Delete Place',
      areYouSureDelete: 'Are you sure you want to delete this?',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      upload: 'Upload',
      khmer: 'ខ្មែរ',
      english: 'English',
      heroSubtitle: 'Explore breathtaking destinations across the Kingdom of Cambodia — from ancient temples to pristine coastlines.',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'km',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
