import {Home, About, NotFound, Test} from './pages';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from "@/components/theme-provider"
import Layout from './Layout.jsx';
import Stock from './pages/Pharmacy/Stock.jsx';
import HospitalAuth from './pages/Hospital/HospitalAuth.jsx';
import UserAuth from './pages/User/UserAuth.jsx';
import BloodDonationHospitalPage from './pages/Hospital/BloodDonationHospitalPage.jsx';
import BloodDonationUserPage from './pages/User/BloodDonationUserPage.jsx';
import HospitalDashboard from './pages/Hospital/Dashboard.jsx';
import BloodReceive from './pages/User/BloodReceive.jsx';
import Emergency from './pages/Hospital/Emergency.jsx';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import PharmacyAuth from './pages/Pharmacy/PharmacyAuth.jsx';
import Dashboard from './pages/Hospital/Dashboard.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'test',
                element: <Test />,
            },
            {
                path: '/pharmacy/auth',
                element: <PharmacyAuth />,
            },
            {
                path: '/pharmacy/stock',
                element: <Stock />,
            },
            {
                path: '/Hospital/auth',
                element: <HospitalAuth />,
            },
            {
                path: '/user/auth',
                element: <UserAuth />,
            },
            {
                path: '/hospital/bloodDonationHospitalPage',
                element: <BloodDonationHospitalPage />,
            },
            {
                path: '/user/bloodDonationUserPage',
                element: <BloodDonationUserPage />,
            },
            {
                path: '/user/bloodreceive',
                element: <BloodReceive />,
            },
            {
                path: '/hospital/Dashboard',
                element: <Dashboard />,
            },
            
            {
                path: '*',
                element: <NotFound />,
            }
        ],
    },
]);

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
