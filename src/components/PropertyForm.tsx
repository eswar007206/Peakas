import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities, getLocalities } from "@/data/properties";
import { useAddProperty } from "@/hooks/useProperties";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import { Upload, CheckCircle, Loader2, X, ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PropertyFormProps {
  onSuccess?: () => void;
}

export const PropertyForm = ({ onSuccess }: PropertyFormProps) => {
  const addProperty = useAddProperty();
  const { uploadImages, uploading, progress, error: uploadError } = useImageUpload();
  const cities = getCities();
  
  const [formData, setFormData] = useState({
    title: "",
    property_type: "" as "apartment" | "house" | "",
    bhk: "" as string,
    city: "",
    location: "",
    start_price: "",
    description: "",
  });
  
  // Store both preview URLs and actual File objects
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const localities = formData.city ? getLocalities(formData.city) : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const remainingSlots = 5 - imageFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      // Add files
      setImageFiles((prev) => [...prev, ...filesToAdd]);
      
      // Create previews
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string].slice(0, 5));
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.property_type || !formData.bhk || !formData.city || !formData.location || !formData.start_price) {
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
          property_type: formData.property_type,
          bhk: parseInt(formData.bhk),
          city: formData.city,
          location: formData.location,
          start_price: parseInt(formData.start_price) * 10000,
          description: formData.description || null,
          images: finalImages,
          status: "draft",
        },
        {
          onSuccess: () => {
            toast.success("物件が正常に登録されました。審査後に公開されます。");
            setFormData({
              title: "",
              property_type: "",
              bhk: "",
              city: "",
              location: "",
              start_price: "",
              description: "",
            });
            setImageFiles([]);
            setImagePreviews([]);
            onSuccess?.();
          },
          onError: () => {
            toast.error("物件の登録に失敗しました。再度お試しください。");
          },
        }
      );
    } catch (err) {
      toast.error("エラーが発生しました。再度お試しください。");
    }
  };

  const isSubmitting = addProperty.isPending || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Title */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title">物件名 *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="例：渋谷駅徒歩５分2LDKマンション"
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>物件種別 *</Label>
          <Select
            value={formData.property_type}
            onValueChange={(value) => setFormData({ ...formData, property_type: value as "apartment" | "house" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">マンション</SelectItem>
              <SelectItem value="house">戸建</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* LDK */}
        <div className="space-y-2">
          <Label>間取り *</Label>
          <Select
            value={formData.bhk}
            onValueChange={(value) => setFormData({ ...formData, bhk: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1LDK</SelectItem>
              <SelectItem value="2">2LDK</SelectItem>
              <SelectItem value="3">3LDK</SelectItem>
              <SelectItem value="4">4LDK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>都市 *</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => setFormData({ ...formData, city: value, location: "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Locality */}
        <div className="space-y-2">
          <Label>エリア *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData({ ...formData, location: value })}
            disabled={!formData.city}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.city ? "選択してください" : "先に都市を選択"} />
            </SelectTrigger>
            <SelectContent>
              {localities.map((locality) => (
                <SelectItem key={locality} value={locality}>
                  {locality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">価格（万円）*</Label>
          <Input
            id="price"
            type="number"
            value={formData.start_price}
            onChange={(e) => setFormData({ ...formData, start_price: e.target.value })}
            placeholder="例：5000"
            min="1"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">物件詳細</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="物件の特徴、設備、周辺環境、アクセスなどを記載してください"
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2 space-y-2">
          <Label>物件画像（最大5枚）</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isSubmitting || imageFiles.length >= 5}
            />
            <label htmlFor="image-upload" className={`cursor-pointer ${imageFiles.length >= 5 ? 'opacity-50' : ''}`}>
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {imageFiles.length >= 5 
                  ? "最大5枚までです" 
                  : "クリックして画像をアップロード (JPEG, PNG, WebP, GIF)"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                1枚あたり最大5MB
              </p>
            </label>
          </div>
          
          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">画像をアップロード中...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden group border border-border">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    disabled={isSubmitting}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
              {imageFiles.length < 5 && (
                <label 
                  htmlFor="image-upload" 
                  className="w-20 h-20 rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {uploading ? "画像をアップロード中..." : "送信中..."}
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            物件を登録する
          </>
        )}
      </Button>
    </form>
  );
};
