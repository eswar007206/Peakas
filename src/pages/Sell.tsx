import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trackPageView } from "@/lib/analytics";
import { Check, ChevronRight, ChevronLeft, Upload, X, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getCities, getLocalities } from "@/data/properties";
import { useAddProperty } from "@/hooks/useProperties";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Sell = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const addProperty = useAddProperty();
  const { uploadImages, uploading, progress } = useImageUpload();
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

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const localities = formData.city ? getLocalities(formData.city) : [];

  useEffect(() => {
    trackPageView("sell");
  }, []);

  const steps = [
    { id: 1, label: "STEP 01", title: "基本情報入力" },
    { id: 2, label: "STEP 02", title: "物件詳細" },
    { id: 3, label: "STEP 03", title: "画像アップロード" },
    { id: 4, label: "STEP 04", title: "確認・申請" },
  ];

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

  const canProceedStep1 = formData.title && formData.property_type && formData.bhk;
  const canProceedStep2 = formData.city && formData.location && formData.start_price;
  const canProceedStep3 = true; // Images are optional

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      let uploadedUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        toast.info("画像をアップロード中...");
        uploadedUrls = await uploadImages(imageFiles);
      }

      const finalImages = uploadedUrls.length > 0 
        ? uploadedUrls 
        : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"];

      addProperty.mutate(
        {
          title: formData.title,
          property_type: formData.property_type as "apartment" | "house",
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
            setIsSubmitted(true);
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

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              申請が完了しました
            </h1>
            <p className="text-gray-600 mb-8">
              物件情報を受け付けました。審査完了後、最短3日で公開されます。
              審査結果はメールでお知らせいたします。
            </p>
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">申請内容</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">物件名</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">物件種別</span>
                  <span className="font-medium">{formData.property_type === "apartment" ? "マンション" : "戸建"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">間取り</span>
                  <span className="font-medium">{formData.bhk}LDK</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">所在地</span>
                  <span className="font-medium">{formData.location}、{formData.city}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">価格</span>
                  <span className="font-medium text-primary">{Number(formData.start_price).toLocaleString()}万円</span>
                </div>
              </div>
            </div>
            <Button onClick={() => window.location.href = "/buy"} className="w-full">
              物件一覧を見る
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              売却エントリー・出品申請
            </h1>
            <p className="text-gray-600">
              専門スタッフが<span className="text-primary font-semibold">最短3日</span>でのスピード出品をフルサポートします。
            </p>
          </div>

          {/* Step Progress Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center w-full">
                    <div className="w-full flex items-center">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          step.id <= currentStep ? "bg-primary" : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs mt-3 font-medium transition-colors ${
                        step.id <= currentStep ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Indicator Circle */}
          <div className="flex justify-center mb-8">
            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-white shadow-lg transition-colors ${
              currentStep === 4 ? "border-green-500" : "border-primary"
            }`}>
              {currentStep === 4 ? (
                <Check className="w-10 h-10 text-green-500" />
              ) : (
                <span className="text-2xl font-bold text-primary">{currentStep}</span>
              )}
            </div>
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">物件名 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="例：渋谷駅徒歩５分2LDKマンション"
                    />
                  </div>

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
                </div>
              )}

              {/* Step 2: Property Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
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
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                          <SelectItem key={locality} value={locality}>{locality}</SelectItem>
                        ))}
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
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">物件詳細</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="物件の特徴、設備、周辺環境、アクセスなどを記載してください"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Image Upload */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>物件画像（最大5枚）</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={imageFiles.length >= 5}
                      />
                      <label htmlFor="image-upload" className={`cursor-pointer ${imageFiles.length >= 5 ? 'opacity-50' : ''}`}>
                        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">
                          {imageFiles.length >= 5 
                            ? "最大5枚までです" 
                            : "クリックして画像をアップロード"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF (最大5MB)</p>
                      </label>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">アップロード中...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreviews.map((preview, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      ))}
                      {imageFiles.length < 5 && (
                        <label 
                          htmlFor="image-upload" 
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </label>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 text-center">
                    画像は任意です。後からでも追加できます。
                  </p>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">入力内容の確認</h3>
                  
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500">物件名</span>
                      <span className="font-medium text-gray-900">{formData.title}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500">物件種別</span>
                      <span className="font-medium text-gray-900">{formData.property_type === "apartment" ? "マンション" : "戸建"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500">間取り</span>
                      <span className="font-medium text-gray-900">{formData.bhk}LDK</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500">所在地</span>
                      <span className="font-medium text-gray-900">{formData.location}、{formData.city}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500">価格</span>
                      <span className="font-medium text-primary">{Number(formData.start_price).toLocaleString()}万円</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500">画像</span>
                      <span className="font-medium text-gray-900">{imageFiles.length}枚</span>
                    </div>
                    {formData.description && (
                      <div className="pt-2">
                        <span className="text-gray-500 block mb-2">物件詳細</span>
                        <p className="text-sm text-gray-700">{formData.description}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    内容を確認後、「申請する」ボタンを押してください。
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    戻る
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                    disabled={
                      (currentStep === 1 && !canProceedStep1) ||
                      (currentStep === 2 && !canProceedStep2)
                    }
                  >
                    次へ
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        申請する
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Note */}
            <p className="text-center text-sm text-gray-500 mt-6">
              ステップ {currentStep} / 4
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sell;


