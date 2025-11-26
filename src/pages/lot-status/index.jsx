import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, CheckCircle2, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/services/api';
import useMqtt from '@/providers/useMqtt';

export default function LotStatusPage() {
  const [lotData, setLotData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const initialLoadDone = useRef(false);
  const { subscribe, connected: mqttConnected } = useMqtt();

  // Load data ban đầu từ API và sau đó kết nối MQTT
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await api.get('/parking-lot');
        setLotData(res.data.data);
        console.log('Fetched initial lot data:', res.data.data);
  setLastUpdate(new Date());
  initialLoadDone.current = true;
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Subscribe to MQTT updates after initial API load
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (!subscribe) return;

    const unsubscribe = subscribe('parking/status', (message) => {
      try {
        const payload = JSON.parse(message);
        // Update lotData according to payload
        setLotData(prevData => prevData.map(lot => {
          if (Object.prototype.hasOwnProperty.call(payload, lot.lot_name)) {
            return { ...lot, is_available: payload[lot.lot_name] };
          }
          return lot;
        }));
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error parsing MQTT message', err);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe]);

  const leftLots = lotData.filter(lot => lot.lot_name.startsWith('A'));
	leftLots.sort((a, b) => a.lot_name.localeCompare(b.lot_name));
  const rightLots = lotData.filter(lot => lot.lot_name.startsWith('B'));
	rightLots.sort((a, b) => a.lot_name.localeCompare(b.lot_name));

  const ParkingLotCard = ({ lot }) => {
    return (
      <Card className={cn(
        "hover:shadow-lg transition-all duration-300 cursor-pointer",
        !lot.is_available 
          ? "border-red-300 bg-red-50 dark:bg-red-950/20" 
          : "border-green-300 bg-green-50 dark:bg-green-950/20"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{lot.lot_name}</CardTitle>
            <div className={cn(
              "p-3 rounded-full transition-colors",
              !lot.is_available 
                ? "bg-red-100 dark:bg-red-900/30" 
                : "bg-green-100 dark:bg-green-900/30"
            )}>
              <Car className={cn(
                "h-6 w-6",
                !lot.is_available ? "text-red-600" : "text-green-600"
              )} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge 
              variant={!lot.is_available ? "destructive" : "success"}
              className="flex items-center gap-1.5 text-sm py-1.5 px-3"
            >
              {!lot.is_available ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Đã đỗ xe</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Còn trống</span>
                </>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trạng Thái Bãi Đỗ Xe</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi tình trạng các lot xe trong thời gian thực
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Cập nhật lúc: {lastUpdate.toLocaleTimeString('vi-VN')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {mqttConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">MQTT Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Connecting...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Lot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {lotData.length} lot
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã Đỗ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {lotData.filter(lot => !lot.is_available).length} lot
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Còn Trống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {lotData.filter(lot => !!lot.is_available).length} lot
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid layout 2 cột: 3 lot bên trái, 3 lot bên phải */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột Trái - Khu A */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-8 bg-blue-500 rounded" />
            Khu A - Bên Trái
          </h2>
          <div className="space-y-4">
            {leftLots.map((lot) => (
              <ParkingLotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>

        {/* Cột Phải - Khu B */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-8 bg-purple-500 rounded" />
            Khu B - Bên Phải
          </h2>
          <div className="space-y-4">
            {rightLots.map((lot) => (
              <ParkingLotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}