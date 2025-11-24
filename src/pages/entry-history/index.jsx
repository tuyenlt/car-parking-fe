import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import api from '@/services/api';
import EntryHistoryFilters from '@/pages/entry-history/components/EntryHistoryFilters';
import EntryHistoryTable from '@/pages/entry-history/components/EntryHistoryTable';
import EntryHistoryPagination from '@/pages/entry-history/components/EntryHistoryPagination';
import EntryHistoryDetailDialog from '@/pages/entry-history/components/EntryHistoryDetailDialog';

export default function EntryHistoryPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all'); // all, paid, unpaid
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Load data
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get('/car-history');
      setData(res.data.data);
      setFilteredData(res.data.data);
    } catch (error) {
      console.error('Error fetching car history:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data khi search hoặc filter thay đổi
  useEffect(() => {
    let filtered = [...data];

    // Filter theo biển số
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.plate_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter theo trạng thái thanh toán
    if (paymentFilter === 'paid') {
      filtered = filtered.filter(item => item.bill && item.bill.is_paid);
    } else if (paymentFilter === 'unpaid') {
      filtered = filtered.filter(item => item.bill && !item.bill.is_paid);
    }
		filtered = filtered.sort((a, b) => new Date(b.entry_time) - new Date(a.entry_time));
    setFilteredData(filtered);
    setCurrentPage(1); // Reset về trang 1 khi filter
  }, [searchQuery, paymentFilter, data]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch Sử Ra Vào</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi lịch sử xe ra vào bãi đỗ
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <EntryHistoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        filteredData={filteredData}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ({filteredData.length} kết quả)</CardTitle>
        </CardHeader>
        <CardContent>
          <EntryHistoryTable 
            currentData={currentData}
            startIndex={startIndex}
            onViewDetail={handleViewDetail}
          />

          {/* Pagination */}
          <EntryHistoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredData.length}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <EntryHistoryDetailDialog
        record={selectedRecord}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
