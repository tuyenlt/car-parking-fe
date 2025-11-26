import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Ticket, 
  Plus, 
  Calendar, 
  CreditCard, 
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import api from '@/services/api';
import { useUserContext } from '@/providers/authContext';
import CreateMonthlyTicketDialog from './components/CreateMonthlyTicketDialog';

export default function MembershipPage() {
  const { user } = useUserContext();
  const [ticket, setTicket] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch vé tháng của user
  const fetchTicket = async () => {
    try {
      const res = await api.get('/users/get-membership-info');
      setTicket(res.data.data || null);
			console.log("Fetched membership ticket:", res.data.data);
    } catch (error) {
      console.error('Error fetching monthly ticket:', error);
      // Nếu chưa có vé thì set null
      setTicket(null);
    } 
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  const handlePayment = (ticketData) => {
    if (ticketData.bill && ticketData.bill.vnp_url) {
      window.open(ticketData.bill.vnp_url, '_blank');
    }
  };

  const hasActiveTicket = ticket && ticket.bill && ticket.bill.is_paid;
	
  const getTicketStatus = (ticketData) => {
		if (!ticketData.bill) {
      return { label: 'Đang xử lý', variant: 'secondary', color: 'gray' };
    }
    
    if (ticketData.bill.is_paid) {
      // Kiểm tra còn hạn không
      const endDate = new Date(ticketData.end_date);
      const today = new Date();
      
      if (endDate < today) {
        return { label: 'Hết hạn', variant: 'destructive', color: 'red' };
      }
      return { label: 'Đang hoạt động', variant: 'success', color: 'green' };
    }
    
    return { label: 'Chưa thanh toán', variant: 'destructive', color: 'orange' };
  };
	const status = ticket ? getTicketStatus(ticket) : null;

  const getRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Đã hết hạn';
    if (diffDays === 0) return 'Hết hạn hôm nay';
    if (diffDays === 1) return 'Còn 1 ngày';
    return `Còn ${diffDays} ngày`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vé Tháng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và thanh toán vé tháng đỗ xe
          </p>
        </div>
        <div className="flex gap-2">
  
        </div>
      </div>

      {/* Thông tin user */}
      {user && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Thông tin xe của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.plate_number}</p>
                <p className="text-sm text-muted-foreground">
                  {hasActiveTicket ? 'Đang sử dụng vé tháng' : 'Chưa có vé tháng'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {!ticket ? (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-muted">
                    <Ticket className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Chưa có vé tháng</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Bạn chưa đăng ký vé tháng. Đăng ký ngay để được sử dụng dịch vụ đỗ xe không giới hạn!
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Đăng ký ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Ticket Card */}
            <Card 
              className={`overflow-hidden ${
                status.label === 'Đang hoạt động'
                  ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20' 
                  : status.label === 'Chưa thanh toán'
                  ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/20'
                  : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-${status.color}-100 dark:bg-${status.color}-900/20`}>
                      <Ticket className={`h-5 w-5 text-${status.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">Vé tháng của bạn</CardTitle>
                      <CardDescription className="text-xs">
                        {ticket.plate_number}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={status.variant}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Thông tin thời gian */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bắt đầu:</span>
                    <span className="font-medium">{formatDateTime(ticket.start_date)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kết thúc:</span>
                    <span className="font-medium">{formatDateTime(ticket.end_date)}</span>
                  </div>
                  {status.label === 'Đang hoạt động' && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Thời hạn:</span>
                      <span className="font-semibold text-green-600">
                        {getRemainingDays(ticket.end_date)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Thông tin thanh toán */}
                {ticket.bill && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Số tiền:</span>
                      <span className="font-bold text-lg text-green-600">
                        {ticket.bill.amount?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    
                    {ticket.bill.is_paid ? (
                      <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Đã thanh toán</span>
                        </div>
                        {ticket.bill.transaction_no && (
                          <p className="text-xs text-muted-foreground mt-1">
                            GD: {ticket.bill.transaction_no}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handlePayment(ticket)}
                        className="w-full"
                        variant="default"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thanh toán ngay
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Thông tin bổ sung */}
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                  <p>Mã vé: {ticket.id?.substring(0, 8)}</p>
                  {ticket.bill?.bill_code && (
                    <p>Mã HĐ: {ticket.bill.bill_code.substring(0, 8)}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quyền lợi vé tháng</CardTitle>
                <CardDescription>Những gì bạn nhận được</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Không giới hạn lượt ra vào</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Đỗ xe thoải mái trong suốt thời hạn vé
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Tiết kiệm chi phí</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rẻ hơn nhiều so với thanh toán theo lượt
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Tiện lợi & nhanh chóng</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Không cần thanh toán mỗi lần ra vào
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ưu tiên vào bãi</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Được ưu tiên khi bãi xe gần đầy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>


      {/* Create Dialog */}
      <CreateMonthlyTicketDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        plateNumber={user?.plate_number}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          fetchTicket();
        }}
      />
    </div>
  );
}
