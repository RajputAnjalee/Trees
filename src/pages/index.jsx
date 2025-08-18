import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Purchase from "./Purchase";

import Orders from "./Orders";

import Profile from "./Profile";

import Notifications from "./Notifications";

import Welcome from "./Welcome";

import Register from "./Register";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Dashboard: Dashboard,
    Purchase: Purchase,
    Orders: Orders,
    Profile: Profile,
    Notifications: Notifications,
    Welcome: Welcome,
    Register: Register,
    ForgotPassword: ForgotPassword,
    ResetPassword: ResetPassword,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Purchase" element={<Purchase />} />
                <Route path="/Orders" element={<Orders />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Notifications" element={<Notifications />} />
                <Route path="/Welcome" element={<Welcome />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
            </Routes>
        </Layout>
    );
}

// Export the main Pages component
export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}