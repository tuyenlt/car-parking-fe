import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContextProvider from '@/providers/authProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { WebSocketProvider } from './providers/WebSocketProvider';
import LotStatusPage from './pages/lot-status';
import EntryHistoryPage from './pages/entry-history';
import PaymentPage from './pages/payment';
import RootLayout from './layouts/RootLayout';
import PaymentReturnPage from './pages/payment-return';

function App() {
	return (
		<Router>
			{/* <AuthContextProvider> */}
				<WebSocketProvider>
						<Routes>				
							<Route element={<RootLayout />}>
								<Route path="/lot-status" element={<LotStatusPage />} />
								<Route path="/entry-history" element={<EntryHistoryPage />} />
								<Route path="/payment" element={<PaymentPage />} />
								<Route path='/payment/vnpay-return' element={<PaymentReturnPage />} />
								<Route path="*" element={<LotStatusPage />} />
							</Route>
						</Routes>
				</WebSocketProvider>
			{/* </AuthContextProvider> */}
		</Router>
	);
}

export default App;
