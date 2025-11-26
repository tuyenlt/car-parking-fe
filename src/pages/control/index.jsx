import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Wifi, WifiOff, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useUserContext } from '@/providers/authContext';
import useMqtt from '@/providers/useMqtt';

export default function ControlPage() {
	const [log, setLog] = useState([]);
	const { user } = useUserContext();
	const { publish, connected: mqttConnected } = useMqtt();

	const addLog = (msg) => {
		setLog(prev => [
			`${new Date().toLocaleTimeString('vi-VN')} - ${msg}`,
			...prev
		].slice(0, 200));
	};

			

	const handlePublish = (topic, message) => {
		if (!publish) {
			addLog('MQTT provider not available');
			return;
		}
		const ok = publish(topic, message);
		if (!ok) addLog('Chưa kết nối tới broker — publish không thực hiện');
		else addLog(`Published ${message} -> ${topic}`);
	};


	if(user?.role !== 'admin'){
		return <div>Bạn không có quyền truy cập trang này.</div>;
	}
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Điều khiển Barrier</h1>
					<p className="text-muted-foreground mt-1">Kết nối tới MQTT và gửi lệnh mở/đóng cổng</p>
				</div>
				<div className="flex items-center gap-4">
		    {mqttConnected ? (
						<div className="flex items-center gap-2 text-green-600">
							<Wifi className="h-5 w-5" />
			    <span>Đã kết nối</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-gray-500">
							<WifiOff className="h-5 w-5" />
							<span>Chưa kết nối</span>
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Cổng vào (entry)</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex gap-2">
							<Button onClick={() => handlePublish('entry/gate/control', 'OPEN_GATE')}>
								<ArrowUpRight className="h-4 w-4 mr-2" /> Mở cổng vào
							</Button>
							<Button variant="destructive" onClick={() => handlePublish('entry/gate/control', 'CLOSE_GATE')}>
								<ArrowDownRight className="h-4 w-4 mr-2" /> Đóng cổng vào
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">Topic: <code>entry/gate/control</code></p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Cổng ra (exit)</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex gap-2">
							<Button onClick={() => handlePublish('exit/gate/control', 'OPEN_GATE')}>
								<ArrowUpRight className="h-4 w-4 mr-2" /> Mở cổng ra
							</Button>
							<Button variant="destructive" onClick={() => handlePublish('exit/gate/control', 'CLOSE_GATE')}>
								<ArrowDownRight className="h-4 w-4 mr-2" /> Đóng cổng ra
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">Topic: <code>exit/gate/control</code></p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Log</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-64 overflow-y-auto font-mono text-sm bg-slate-50 p-3 rounded">
						{log.map((l, idx) => (
							<div key={idx}>{l}</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}