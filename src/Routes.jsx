import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import GoalsList from './pages/goals-list';
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import EditGoal from './pages/edit-goal';
import DailyCheckIn from './pages/daily-check-in';
import CheckInHistory from './pages/check-in-history';
import AddGoal from './pages/add-goal';
import ProfilePage from './pages/profile';
import AccountSettingsPage from './pages/account-settings';
import AICoach from './pages/ai-coach';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AddGoal />} />
        <Route path="/goals-list" element={<GoalsList />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/edit-goal" element={<EditGoal />} />
        <Route path="/daily-check-in" element={<DailyCheckIn />} />
        <Route path="/check-in-history" element={<CheckInHistory />} />
        <Route path="/add-goal" element={<AddGoal />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;