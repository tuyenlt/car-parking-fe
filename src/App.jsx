import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContextProvider from '@/providers/authProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Signin from './pages/SignIn';
import LotStatusPage from './pages/lot-status';
import EntryHistoryPage from './pages/entry-history';
import PaymentPage from './pages/payment';
import RootLayout from './layouts/RootLayout';
import PaymentReturnPage from './pages/payment-return';

function App() {
	return (
		<Router>
			<AuthContextProvider>
						<Routes>	
							<Route path='/login' element={<Signin />} />
							<Route element={<RootLayout />}>
								<Route path="/lot-status" element={<LotStatusPage />} />
								<Route path="/entry-history" element={<EntryHistoryPage />} />
								<Route path="/payment" element={<PaymentPage />} />
								<Route path='/payment/vnpay-return' element={<PaymentReturnPage />} />
								<Route path="*" element={<LotStatusPage />} />
							</Route>
						</Routes>
			</AuthContextProvider>
		</Router>
	);
}

export default App;
