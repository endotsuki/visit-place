import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader, X, Upload } from 'lucide-react';
import { supabase, Place } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AdminFormProps {
  place?: Place;
  onClose: () => void;
}

export default function AdminForm({ place, onClose }: AdminFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>(place?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name_km: place?.name_km || '',
    name_en: place?.name_en || '',
    province_km: place?.province_km || '',
    province_en: place?.province_en || '',
    description_km: place?.description_km || '',
    description_en: place?.description_en || '',
    keywords: place?.keywords.join(', ') || '',
    map_link: place?.map_link || '',
    lat: place?.coordinates?.lat || 0,
    lng: place?.coordinates?.lng || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary configuration missing');
      return null;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', uploadPreset);
    formDataUpload.append('folder', 'cambodia-travel');
    formDataUpload.append('transformation', JSON.stringify({
      width: 1280,
      height: 1280,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    }));

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const newImages: string[] = [];

    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (url) {
        newImages.push(url);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploadingImages(false);
    toast.success(`${newImages.length} image(s) uploaded`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const keywords = formData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const coordinates = {
        lat: parseFloat(formData.lat.toString()),
        lng: parseFloat(formData.lng.toString()),
      };

      const placeData = {
        name_km: formData.name_km,
        name_en: formData.name_en,
        province_km: formData.province_km,
        province_en: formData.province_en,
        description_km: formData.description_km,
        description_en: formData.description_en,
        keywords,
        coordinates,
        map_link: formData.map_link,
        images,
      };

      if (place?.id) {
        // Update
        const { error } = await supabase
          .from('places')
          .update(placeData)
          .eq('id', place.id);

        if (error) throw error;
        toast.success('Place updated successfully');
      } else {
        // Create
        const { error } = await supabase
          .from('places')
          .insert([placeData]);

        if (error) throw error;
        toast.success('Place created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Error saving place:', error);
      toast.error('Failed to save place');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {place ? t('editPlace') : t('addPlace')}
        </h2>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name (Khmer)
          </label>
          <Input
            type="text"
            name="name_km"
            value={formData.name_km}
            onChange={handleInputChange}
            required
            placeholder="នាមកន្លែង"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name (English)
          </label>
          <Input
            type="text"
            name="name_en"
            value={formData.name_en}
            onChange={handleInputChange}
            required
            placeholder="Place name"
          />
        </div>
      </div>

      {/* Province Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Province (Khmer)
          </label>
          <Input
            type="text"
            name="province_km"
            value={formData.province_km}
            onChange={handleInputChange}
            required
            placeholder="ខេត្ត"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Province (English)
          </label>
          <Input
            type="text"
            name="province_en"
            value={formData.province_en}
            onChange={handleInputChange}
            required
            placeholder="Province"
          />
        </div>
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description (Khmer)
          </label>
          <textarea
            name="description_km"
            value={formData.description_km}
            onChange={handleInputChange}
            placeholder="ពិពណ៌នា"
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description (English)
          </label>
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Latitude
          </label>
          <Input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleInputChange}
            step="0.000001"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Longitude
          </label>
          <Input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleInputChange}
            step="0.000001"
            required
          />
        </div>
      </div>

      {/* Map Link */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Google Maps Link
        </label>
        <Input
          type="url"
          name="map_link"
          value={formData.map_link}
          onChange={handleInputChange}
          required
          placeholder="https://maps.google.com/?q=..."
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Keywords (comma-separated)
        </label>
        <Input
          type="text"
          name="keywords"
          value={formData.keywords}
          onChange={handleInputChange}
          placeholder="temple, ancient, cultural"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Images
        </label>
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImages}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImages}
            variant="outline"
            className="gap-2"
          >
            {uploadingImages ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                {t('upload')}ing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {t('upload')} Images
              </>
            )}
          </Button>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <Button
          type="submit"
          disabled={loading || images.length === 0}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              {t('save')}ing...
            </>
          ) : (
            t('save')
          )}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
