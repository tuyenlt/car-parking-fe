import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Clock,
  Image as ImageIcon,
  ExternalLink,
  Banknote,
  Receipt,
  Ticket
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function EntryHistoryDetailDialog({ record, open, onOpenChange }) {
  if (!record) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: vi });
  };

  const getPaymentStatus = (record) => {
    // Nếu là vé tháng, luôn hiển thị là đã thanh toán
    if (record.bill && record.bill.bill_type === 'monthly') {
      return { status: 'monthly', label: 'Vé tháng', variant: 'default' };
    }
    if (record.bill && record.bill.is_paid) {
      return { status: 'paid', label: 'Đã thanh toán', variant: 'success' };
    }
    if (record.bill && !record.bill.is_paid) {
      return { status: 'unpaid', label: 'Chưa thanh toán', variant: 'destructive' };
    }
    if (record.exit_time && !record.bill) {
      return { status: 'pending', label: 'Đang xử lý', variant: 'secondary' };
    }
    return { status: 'in-parking', label: 'Đang đỗ', variant: 'secondary' };
  };

  const handlePayment = () => {
    if (record.bill && record.bill.vnp_url) {
      window.open(record.bill.vnp_url, '_blank');
    }
  };

  const calculateParkingDuration = () => {
    if (!record.entry_time) return '-';
    
    const entryTime = new Date(record.entry_time);
    const exitTime = record.exit_time ? new Date(record.exit_time) : new Date();
    const diffMs = exitTime - entryTime;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  const paymentStatus = getPaymentStatus(record);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chi Tiết Lịch Sử Xe</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về lịch sử ra vào của xe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Biển số và trạng thái */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Biển số xe</p>
                <p className="text-2xl font-bold">{record.plate_number}</p>
              </div>
            </div>
            <Badge variant={paymentStatus.variant} className="text-base py-1 px-3">
              {paymentStatus.label}
            </Badge>
          </div>

          <Separator />

          {/* Thông tin thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Thời gian vào</p>
                  <p className="text-base font-semibold">{formatDateTime(record.entry_time)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Vị trí vào</p>
                  <p className="text-base">{record.entry_location || '-'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Thời gian ra</p>
                  <p className="text-base font-semibold">
                    {record.exit_time ? formatDateTime(record.exit_time) : 'Chưa ra'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Vị trí ra</p>
                  <p className="text-base">{record.exit_location || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thời gian đỗ */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Thời gian đỗ</p>
              <p className="text-xl font-bold text-blue-600">{calculateParkingDuration()}</p>
            </div>
          </div>

          <Separator />

          {/* Thông tin thanh toán */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông tin thanh toán
            </h3>
            
            {!record.bill ? (
              <div className="border rounded-lg p-4 bg-muted text-center">
                <p className="text-sm text-muted-foreground">
                  {record.exit_time ? 'Hóa đơn đang được xử lý' : 'Xe chưa ra, chưa có hóa đơn'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Số tiền và trạng thái */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Mã hóa đơn</p>
                      <p className="text-sm font-mono">{record.bill.bill_code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Thời gian tạo</p>
                      <p className="text-sm">{formatDateTime(record.bill.bill_time)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Banknote className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Số tiền</p>
                    <p className="text-2xl font-bold text-green-600">
                      {record.bill.amount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                {record.bill.description && (
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                    <p className="text-sm">{record.bill.description}</p>
                  </div>
                )}

                {/* Hiển thị thông tin vé tháng */}
                {record.bill.bill_type === 'monthly' && (
                  <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Ticket className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-400 text-lg">
                          Vé tháng
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Đã thanh toán - Sử dụng không giới hạn
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-white dark:bg-slate-900 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Loại vé:</span>
                        <Badge variant="default" className="bg-blue-600">
                          Vé tháng
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Trạng thái:</span>
                        <Badge variant="success">
                          Đã thanh toán
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">Miễn phí đỗ xe:</span>
                        <span className="text-sm font-bold text-blue-600">
                          ✓ Không giới hạn
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nếu chưa thanh toán và KHÔNG phải vé tháng - hiển thị nút thanh toán */}
                {!record.bill.is_paid && record.bill.bill_type !== 'monthly' && (
                  <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-orange-800 dark:text-orange-400">
                          Hóa đơn chưa thanh toán
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Vui lòng thanh toán để hoàn tất
                        </p>
                      </div>
                      <Badge variant="destructive">Chưa thanh toán</Badge>
                    </div>
                    <Button 
                      onClick={handlePayment}
                      className="w-full"
                      variant="default"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Thanh toán ngay
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Nếu đã thanh toán và KHÔNG phải vé tháng - hiển thị thông tin giao dịch */}
                {record.bill.is_paid && record.bill.bill_type !== 'monthly' && (
                  <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-green-800 dark:text-green-400">
                        Đã thanh toán thành công
                      </p>
                      <Badge variant="success">Đã thanh toán</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {record.bill.transaction_no && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Mã giao dịch:</span>
                          <span className="text-sm font-mono font-semibold">
                            {record.bill.transaction_no}
                          </span>
                        </div>
                      )}
                      
                      {record.bill.bank_code && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Ngân hàng:</span>
                          <span className="text-sm font-semibold">
                            {record.bill.bank_code}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Số tiền đã thanh toán:</span>
                        <span className="text-lg font-bold text-green-600">
                          {record.bill.amount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Hình ảnh */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hình ảnh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hình vào */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Hình ảnh vào</p>
                {record.entry_image ? (
                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${record.entry_image}`}
                      alt="Entry"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg h-48 flex items-center justify-center bg-muted">
                    <p className="text-sm text-muted-foreground">Không có hình ảnh</p>
                  </div>
                )}
              </div>

              {/* Hình ra */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Hình ảnh ra</p>
                {record.exit_image ? (
                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/${record.exit_image}`}
                      alt="Exit"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg h-48 flex items-center justify-center bg-muted">
                    <p className="text-sm text-muted-foreground">
                      {record.exit_time ? 'Không có hình ảnh' : 'Xe chưa ra'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-muted rounded-lg p-4 text-xs text-muted-foreground space-y-1">
            <p><strong>Tạo lúc:</strong> {formatDateTime(record.created_at)}</p>
            <p><strong>Cập nhật:</strong> {formatDateTime(record.updated_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
