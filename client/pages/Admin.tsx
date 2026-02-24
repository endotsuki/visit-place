import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2, Loader } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase, Place } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import AdminForm from "@/components/AdminForm";
import { useLocation } from "wouter";

export default function Admin() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [authenticating, setAuthenticating] = useState(true);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/admin/login");
          return;
        }

        setAuthenticating(false);
        fetchPlaces();
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlaces((data || []) as Place[]);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deletePlace"))) return;

    try {
      const { error } = await supabase.from("places").delete().eq("id", id);

      if (error) throw error;
      await fetchPlaces();
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const handleFormClose = async () => {
    setShowForm(false);
    setEditingPlace(null);
    await fetchPlaces();
  };

  if (authenticating) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <Loader className="h-12 w-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{t("admin")}</h1>
            <p className="text-muted-foreground mt-2">
              {places.length} {t("admin")} places
            </p>
          </div>
          <div className="flex gap-2">
            {!showForm && !editingPlace && (
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                {t("addPlace")}
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Form Section */}
        {(showForm || editingPlace) && (
          <div className="mb-8">
            <AdminForm
              place={editingPlace || undefined}
              onClose={handleFormClose}
            />
          </div>
        )}

        {/* Places List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground mb-4">No places yet</p>
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              {t("addPlace")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {place.name_en} / {place.name_km}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {place.province_en} / {place.province_km}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {place.images?.length || 0} images • {place.keywords.length}{" "}
                    keywords
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingPlace(place)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    {t("editPlace")}
                  </Button>
                  <Button
                    onClick={() => handleDelete(place.id)}
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("deletePlace")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
