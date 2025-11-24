import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Car, CreditCard, Clock, DoorOpen } from 'lucide-react';

export default function EntryHistoryFilters({ 
  searchQuery, 
  setSearchQuery, 
  paymentFilter, 
  setPaymentFilter,
  filteredData 
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo biển số xe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Payment Filter */}
          <div className="w-full md:w-[250px]">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-muted-foreground">Tổng số</p>
              <p className="font-semibold">{filteredData.length} xe</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-muted-foreground">Đã thanh toán</p>
              <p className="font-semibold">
                {filteredData.filter(item => item.bill && item.bill.is_paid).length} xe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <Clock className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-muted-foreground">Chưa thanh toán</p>
              <p className="font-semibold">
                {filteredData.filter(item => item.bill && !item.bill.is_paid).length} xe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <DoorOpen className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-muted-foreground">Đang đỗ</p>
              <p className="font-semibold">
                {filteredData.filter(item => item.exit_time === null).length} xe
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
