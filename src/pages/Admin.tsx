import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAllProperties, useUpdateProperty, useDeleteProperty, Property } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { useAnalyticsSummary, trackPageView } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Eye, EyeOff, Search, Plus, BarChart3, Loader2, LogOut, MousePointerClick } from "lucide-react";
import { AdminPropertyForm } from "@/components/AdminPropertyForm";

import { formatPrice, formatDate } from "@/lib/formatPrice";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { data: properties = [], isLoading } = useAllProperties();
  const { data: analytics } = useAnalyticsSummary();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    trackPageView("admin");
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateProperty.mutate({ id, updates: { status } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("この物件を削除してもよろしいですか？")) {
      deleteProperty.mutate(id);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-sm mx-auto text-center">
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                アクセス拒否
              </h1>
              <p className="text-muted-foreground mb-6">
                管理者権限がありません。管理者にお問い合わせください。
              </p>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                サインアウト
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              管理ダッシュボード
            </h1>
            <p className="text-muted-foreground">
              全ての物件を管理
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              物件を追加
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              サインアウト
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div 
            className="bg-card rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 border border-transparent transition-all"
            onClick={() => setStatusFilter("all")}
          >
            <p className="text-sm text-muted-foreground">全物件数</p>
            <p className="text-2xl font-bold text-foreground">{properties.length}</p>
          </div>
          <div 
            className="bg-card rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 border border-transparent transition-all"
            onClick={() => setStatusFilter("published")}
          >
            <p className="text-sm text-muted-foreground">公開中</p>
            <p className="text-2xl font-bold text-foreground">
              {properties.filter((p) => p.status === "published").length}
            </p>
          </div>
          <div 
            className="bg-card rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 border border-transparent transition-all"
            onClick={() => setStatusFilter("draft")}
          >
            <p className="text-sm text-muted-foreground">下書き</p>
            <p className="text-2xl font-bold text-foreground">
              {properties.filter((p) => p.status === "draft").length}
            </p>
          </div>
          <div 
            className="bg-card rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 border border-transparent transition-all"
            onClick={() => navigate("/admin/page-views")}
          >
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> ページビュー
            </p>
            <p className="text-2xl font-bold text-foreground">{analytics?.pageViews ?? 0}</p>
          </div>
          <div 
            className="bg-card rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 border border-transparent transition-all"
            onClick={() => navigate("/admin/property-clicks")}
          >
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MousePointerClick className="w-3.5 h-3.5" /> クリック数
            </p>
            <p className="text-2xl font-bold text-foreground">{analytics?.propertyClicks ?? 0}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">表示中</p>
            <p className="text-2xl font-bold text-foreground">{filteredProperties.length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="物件を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="published">公開中</SelectItem>
              <SelectItem value="draft">下書き</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">物件</TableHead>
                  <TableHead>間取り</TableHead>
                  <TableHead>エリア</TableHead>
                  <TableHead>価格</TableHead>
                  <TableHead>作成日</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.slice(0, 50).map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {property.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {property.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{property.bhk}LDK</TableCell>
                    <TableCell>
                      {property.location}, {property.city}
                    </TableCell>
                    <TableCell className="font-medium text-price">
                      {formatPrice(property.start_price)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(property.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={property.status === "published" ? "default" : "secondary"}
                      >
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(
                              property.id,
                              property.status === "published" ? "draft" : "published"
                            )
                          }
                          title={property.status === "published" ? "Unpublish" : "Publish"}
                          disabled={updateProperty.isPending}
                        >
                          {property.status === "published" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(property.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={deleteProperty.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredProperties.length > 50 && (
            <div className="p-4 text-center text-sm text-muted-foreground border-t">
              {filteredProperties.length}件中最初の50件を表示
            </div>
          )}
        </div>
      </div>

      {/* Add Property Form Modal */}
      {showAddForm && <AdminPropertyForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
};

export default Admin;
