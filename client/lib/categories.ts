// each category now includes both English and Khmer labels so the UI
// can render bilingual options while keeping the stored `value` simple.
export interface Category {
  value: string;
  label_en: string;
  label_km: string;
}

export const CATEGORIES: Category[] = [
  { value: 'Beach', label_en: 'Beach', label_km: 'ឆ្នេរ' },
  { value: 'Mountain', label_en: 'Mountain', label_km: 'ភ្នំ' },
  { value: 'Temple', label_en: 'Temple', label_km: 'ប្រាសាទ' },
  { value: 'Waterfall', label_en: 'Waterfall', label_km: 'ទឹកជ្រោះ' },
  { value: 'City', label_en: 'City', label_km: 'ទីក្រុង' },
  { value: 'Nature', label_en: 'Nature', label_km: 'ធម្មជាតិ' },
  { value: 'Food', label_en: 'Food', label_km: 'ម្ហូប' },
];
