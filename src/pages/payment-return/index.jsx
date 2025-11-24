import api from "@/services/api";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Car, 
  CreditCard, 
  Receipt,
  Calendar,
  Banknote,
  ArrowLeft,
  Home,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      setLoading(true);
      try {
        // Lấy tất cả query params
        const params = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const res = await api.get('/bill/vnpay-return', { params });
        setPaymentStatus(res.data.data);
      } catch (error) {
        console.error("Error handling payment return:", error);
        setError(error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán");
      } finally {
        setLoading(false);
      }
    };
    
    handlePaymentReturn();
  }, [searchParams]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: vi });
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') || '0';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <div className="text-center">
                <h2 className="text-xl font-semibold">Đang xử lý thanh toán...</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Vui lòng đợi trong giây lát
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !paymentStatus) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">Thanh toán thất bại</CardTitle>
            <CardDescription className="text-base mt-2">
              {error || "Không thể xác nhận thanh toán"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Button 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  const { success, message, bill } = paymentStatus;

  if (!success || !bill) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md border-orange-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-4">
                <XCircle className="h-16 w-16 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-orange-600">
              {message || "Thanh toán không thành công"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/entry-history")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Button 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-2xl border-green-200">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-green-600">Thanh toán thành công!</CardTitle>
          <CardDescription className="text-base mt-2">
            {message || "Giao dịch của bạn đã được xử lý thành công"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Số tiền */}
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 text-center border-2 border-green-200">
            <p className="text-sm text-muted-foreground mb-2">Số tiền đã thanh toán</p>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(bill.amount)}đ
            </p>
          </div>

          <Separator />

          {/* Thông tin hóa đơn */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Thông tin hóa đơn
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Mã hóa đơn:</span>
                <span className="font-mono font-semibold">{bill.bill_code}</span>
              </div>
              
              {bill.description && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Mô tả:</span>
                  <span className="font-medium text-right max-w-xs">{bill.description}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Thời gian thanh toán:</span>
                <span className="font-medium">{formatDateTime(bill.bill_time)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin giao dịch */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông tin giao dịch
            </h3>
            <div className="space-y-3">
              {bill.transaction_no && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Mã giao dịch:</span>
                  <span className="font-mono font-semibold">{bill.transaction_no}</span>
                </div>
              )}
              
              {bill.bank_code && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <Badge variant="outline" className="font-semibold">
                    {bill.bank_code}
                  </Badge>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Phương thức thanh toán:</span>
                <Badge variant="secondary">{bill.payment_method || 'VNPay'}</Badge>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Đã thanh toán
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Hóa đơn:</span>
              <span className="font-mono text-xs">{bill.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạo lúc:</span>
              <span>{formatDateTime(bill.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cập nhật lúc:</span>
              <span>{formatDateTime(bill.updated_at)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/entry-history')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Xem lịch sử
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}