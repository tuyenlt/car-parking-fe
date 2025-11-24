import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Car,
  DoorOpen,
  DoorClosed,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function EntryHistoryTable({ currentData, startIndex, onViewDetail }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: vi });
  };

  const getPaymentStatus = (record) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">STT</TableHead>
            <TableHead>Biển số</TableHead>
            <TableHead>Thời gian vào</TableHead>
            <TableHead>Thời gian ra</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[100px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Không tìm thấy dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((record, index) => {
              const paymentStatus = getPaymentStatus(record);
              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{record.plate_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDateTime(record.entry_time)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.exit_time ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDateTime(record.exit_time)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.bill && record.bill.amount ? (
                      <span className="font-semibold text-green-600">
                        {record.bill.amount.toLocaleString('vi-VN')}đ
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={paymentStatus.variant}>
                      {paymentStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetail(record)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
