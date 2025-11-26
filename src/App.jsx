import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContextProvider from '@/providers/authProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Signin from './pages/SignIn';
import SignUp from './pages/SignUp';
import LotStatusPage from './pages/lot-status';
import EntryHistoryPage from './pages/entry-history';
import PaymentPage from './pages/payment';
import RootLayout from './layouts/RootLayout';
import PaymentReturnPage from './pages/payment-return';
import MembershipPage from './pages/member-ship';
import ControlPage from './pages/control';
import MqttProvider from './providers/MqttProvider';

function App() {
	return (
		<Router>
			<AuthContextProvider>
				<MqttProvider>
						<Routes>	
							<Route path='/login' element={<Signin />} />
							<Route path='/signup' element={<SignUp />} />
							<Route element={<RootLayout />}>
								<Route path='/control' element={<ControlPage />} />
								<Route path="/lot-status" element={<LotStatusPage />} />
								<Route path="/entry-history" element={<EntryHistoryPage />} />
								<Route path="/membership" element={<MembershipPage />} />
								<Route path="/payment" element={<PaymentPage />} />
								<Route path='/payment/vnpay-return' element={<PaymentReturnPage />} />
								<Route path="*" element={<LotStatusPage />} />
							</Route>
						</Routes>
				</MqttProvider>
			</AuthContextProvider>
		</Router>
	);
}

export default App;
