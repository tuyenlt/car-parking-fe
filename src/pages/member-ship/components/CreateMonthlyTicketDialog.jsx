import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Car } from 'lucide-react';
import api from '@/services/api';

// Các gói vé tháng
const TICKET_PACKAGES = [
  { value: '1', label: '1 tháng', amount: 500000, months: 1 },
  { value: '3', label: '3 tháng', amount: 1400000, months: 3 },
  { value: '6', label: '6 tháng', amount: 2700000, months: 6 },
  { value: '12', label: '12 tháng', amount: 5000000, months: 12 },
];

export default function CreateMonthlyTicketDialog({ open, onOpenChange, onSuccess, plateNumber }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleClose = () => {
    setError('');
    setSelectedPackage(null);
    onOpenChange(false);
  };

	const getMemberShipType = (months) =>{
		switch(months){
			case 1:
				return "1_month";
			case 3:
				return "3_months";
			case 6:
				return "6_months";
			case 12:
				return "12_months";
			default:
				return null;
		}
	}

  const onSubmit = async () => {
    if (!selectedPackage) {
      setError('Vui lòng chọn gói vé tháng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        membership_type: getMemberShipType(selectedPackage.months),
      };

      const res = await api.post('/users/register-membership', payload);
      
      if (res.data.success) {
        // Nếu có URL thanh toán, mở trong tab mới
        if (res.data.data.bill && res.data.data.bill.vnp_url) {
          window.open(res.data.data.bill.vnp_url, '_blank');
        }
        
        onSuccess();
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký vé tháng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đăng ký vé tháng</DialogTitle>
          <DialogDescription>
            Chọn gói vé tháng phù hợp cho xe {plateNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          {/* Hiển thị biển số xe */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Biển số xe</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {plateNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Chọn gói */}
          <div className="space-y-2">
            <Label htmlFor="package">
              Chọn gói vé <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedPackage?.value}
              onValueChange={(value) => {
                const pkg = TICKET_PACKAGES.find((p) => p.value === value);
                setSelectedPackage(pkg);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn gói vé tháng" />
              </SelectTrigger>
              <SelectContent>
                {TICKET_PACKAGES.map((pkg) => (
                  <SelectItem key={pkg.value} value={pkg.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{pkg.label}</span>
                      <span className="ml-4 font-semibold text-green-600">
                        {pkg.amount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hiển thị thông tin gói đã chọn */}
          {selectedPackage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Gói {selectedPackage.label}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Thời hạn: {selectedPackage.months} tháng
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Số tiền: <span className="font-bold">
                      {selectedPackage.amount.toLocaleString('vi-VN')}đ
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !selectedPackage}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký và thanh toán'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
