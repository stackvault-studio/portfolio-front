import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import PortfolioHomeDashboard from './pages/portfolio-home-dashboard';
import TechnologiesShowcase from './pages/technologies-showcase';
import EducationCertifications from './pages/education-certifications';
import WorkExperienceTimeline from './pages/work-experience-timeline';
import ChatPage from './pages/ai-chatbot/ChatPage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={< PortfolioHomeDashboard/>} />
        <Route path="/technologies-showcase" element={<TechnologiesShowcase />} />
        <Route path="/education-certifications" element={<EducationCertifications />} />
        <Route path="/work-experience-timeline" element={<WorkExperienceTimeline />} />
        <Route path="/mission-rate-calculator" element={<ChatPage/>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
