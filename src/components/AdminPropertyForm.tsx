import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAddProperty } from "@/hooks/useProperties";
import { useImageUpload } from "@/hooks/useImageUpload";
import { getCities, getLocalities } from "@/data/properties";
import { Plus, X, Loader2, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface AdminPropertyFormProps {
  onClose: () => void;
}

export const AdminPropertyForm = ({ onClose }: AdminPropertyFormProps) => {
  const addProperty = useAddProperty();
  const { uploadImages, uploading, progress } = useImageUpload();
  const cities = getCities();

  const [formData, setFormData] = useState({
    title: "",
    bhk: "2" as string,
    start_price: "",
    city: "",
    location: "",
    property_type: "apartment" as string,
    status: "draft" as string,
    description: "",
  });

  // Image upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const localities = formData.city ? getLocalities(formData.city) : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const remainingSlots = 5 - imageFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      setImageFiles((prev) => [...prev, ...filesToAdd]);
      
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string].slice(0, 5));
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.start_price || !formData.city || !formData.location) {
      toast.error("必須項目をすべて入力してください");
      return;
    }

    try {
      // Upload images to Supabase Storage
      let uploadedUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        toast.info("画像をアップロード中...");
        uploadedUrls = await uploadImages(imageFiles);
        
        if (uploadedUrls.length === 0 && imageFiles.length > 0) {
          toast.error("画像のアップロードに失敗しました。再度お試しください。");
          return;
        }
      }

      // Use uploaded URLs or fallback to default
      const finalImages = uploadedUrls.length > 0 
        ? uploadedUrls 
        : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"];

      addProperty.mutate(
        {
          title: formData.title,
          bhk: parseInt(formData.bhk),
          start_price: parseFloat(formData.start_price) * 10000,
          city: formData.city,
          location: formData.location,
          property_type: formData.property_type,
          status: formData.status,
          description: formData.description || null,
          images: finalImages,
        },
        {
          onSuccess: () => {
            toast.success("物件が追加されました！");
            onClose();
          },
          onError: () => {
            toast.error("物件の追加に失敗しました。再度お試しください。");
          },
        }
      );
    } catch (err) {
      toast.error("エラーが発生しました。再度お試しください。");
    }
  };

  const isSubmitting = addProperty.isPending || uploading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-card-hover max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">新規物件を追加</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">物件名 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例：渋谷駅徒歩５分2LDKマンション"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bhk">間取り *</Label>
              <Select value={formData.bhk} onValueChange={(v) => setFormData({ ...formData, bhk: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1LDK</SelectItem>
                  <SelectItem value="2">2LDK</SelectItem>
                  <SelectItem value="3">3LDK</SelectItem>
                  <SelectItem value="4">4LDK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">価格（万円）*</Label>
              <Input
                id="price"
                type="number"
                value={formData.start_price}
                onChange={(e) => setFormData({ ...formData, start_price: e.target.value })}
                placeholder="例：5000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">都市 *</Label>
              <Select 
                value={formData.city} 
                onValueChange={(v) => setFormData({ ...formData, city: v, location: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">エリア *</Label>
              <Select 
                value={formData.location} 
                onValueChange={(v) => setFormData({ ...formData, location: v })}
                disabled={!formData.city}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {localities.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">物件種別</Label>
              <Select 
                value={formData.property_type} 
                onValueChange={(v) => setFormData({ ...formData, property_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">マンション</SelectItem>
                  <SelectItem value="house">戸建</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="published">公開中</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">物件詳細</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="物件の特徴、設備、周辺環境などを記載"
              rows={3}
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>物件画像（最大5枚）</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="admin-image-upload"
                disabled={isSubmitting || imageFiles.length >= 5}
              />
              <label htmlFor="admin-image-upload" className={`cursor-pointer ${imageFiles.length >= 5 ? 'opacity-50' : ''}`}>
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-sm text-muted-foreground">
                  {imageFiles.length >= 5 ? "最大5枚まで" : "クリックしてアップロード"}
                </p>
              </label>
            </div>
            
            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">アップロード中...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden group border border-border">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={isSubmitting}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {imageFiles.length < 5 && (
                  <label 
                    htmlFor="admin-image-upload" 
                    className="w-16 h-16 rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50"
                  >
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? "アップロード中..." : "追加中..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  物件を追加
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
