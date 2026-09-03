import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import AdminLayout from "@/layout/AdminLayout";
import Login from "@/pages/Login";
import Overview from "@/pages/dashboard/Overview";
import LiveActivity from "@/pages/dashboard/LiveActivity";
import Revenue from "@/pages/dashboard/Revenue";
import SystemStatus from "@/pages/dashboard/SystemStatus";
import AllCustomers from "@/pages/customers/AllCustomers";
import CustomerProfile from "@/pages/customers/CustomerProfile";
import { AllUsers, Organizations, Projects } from "@/pages/customers/Users";
import { Plans, Billing, Credits } from "@/pages/commercial/Commercial";
import {
  ApiManagement, Paluku, Vinu, Vaaradhi, Thodu, VoiceLibrary, LanguagesPage
} from "@/pages/platform/Platform";
import {
  ObsOverview, VoiceSessions, ChatSessions, ApiLogs, Errors, Performance
} from "@/pages/observability/Observability";
import {
  VoiceSessionDetail, ChatSessionDetail, ConversationInspector, RequestTraces, TraceDetail
} from "@/pages/observability/Detail";
import {
  CustomRetention, ObservabilityPlans, AudioStorage
} from "@/pages/observability/Enterprise";
import {
  CustomerAnalytics, UsageAnalytics, RevenueAnalytics, Geography, Reports
} from "@/pages/analytics/Analytics";
import { Support, Notifications, Cms } from "@/pages/operations/Operations";
import { CMSEditor, BroadcastCampaigns } from "@/pages/operations/Content";
import {
  SecurityDashboard, AuditLogs, DataRetention, DataRequests, AbuseMonitoring
} from "@/pages/security/Security";
import {
  AdminUsers, Roles, Infrastructure, Incidents, Settings, Integrations
} from "@/pages/system/System";
import AdminDetail from "@/pages/system/AdminDetail";
import {
  FraudAutoActions, GpuMonitoring, MaintenanceScheduler, WebhooksAndJobs
} from "@/pages/system/Advanced";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Toaster theme="dark" position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard/overview" replace />} />

              {/* Dashboard */}
              <Route path="dashboard/overview" element={<Overview />} />
              <Route path="dashboard/live" element={<LiveActivity />} />
              <Route path="dashboard/revenue" element={<Revenue />} />
              <Route path="dashboard/status" element={<SystemStatus />} />

              {/* Customers */}
              <Route path="customers/all" element={<AllCustomers />} />
              <Route path="customers/all/:id" element={<CustomerProfile />} />
              <Route path="customers/organizations" element={<Organizations />} />
              <Route path="customers/users" element={<AllUsers />} />
              <Route path="customers/projects" element={<Projects />} />

              {/* Commercial */}
              <Route path="commercial/plans" element={<Plans />} />
              <Route path="commercial/billing" element={<Billing />} />
              <Route path="commercial/credits" element={<Credits />} />

              {/* Platform */}
              <Route path="platform/api" element={<ApiManagement />} />
              <Route path="platform/paluku" element={<Paluku />} />
              <Route path="platform/vinu" element={<Vinu />} />
              <Route path="platform/vaaradhi" element={<Vaaradhi />} />
              <Route path="platform/thodu" element={<Thodu />} />
              <Route path="platform/voices" element={<VoiceLibrary />} />
              <Route path="platform/languages" element={<LanguagesPage />} />

              {/* Observability */}
              <Route path="observability/overview" element={<ObsOverview />} />
              <Route path="observability/voice" element={<VoiceSessions />} />
              <Route path="observability/voice/:id" element={<VoiceSessionDetail />} />
              <Route path="observability/chat" element={<ChatSessions />} />
              <Route path="observability/chat/:id" element={<ChatSessionDetail />} />
              <Route path="observability/inspector" element={<ConversationInspector />} />
              <Route path="observability/traces" element={<RequestTraces />} />
              <Route path="observability/traces/:id" element={<TraceDetail />} />
              <Route path="observability/logs" element={<ApiLogs />} />
              <Route path="observability/errors" element={<Errors />} />
              <Route path="observability/performance" element={<Performance />} />
              <Route path="observability/audio" element={<AudioStorage />} />
              <Route path="observability/retention" element={<CustomRetention />} />
              <Route path="observability/plans" element={<ObservabilityPlans />} />

              {/* Analytics */}
              <Route path="analytics/customers" element={<CustomerAnalytics />} />
              <Route path="analytics/usage" element={<UsageAnalytics />} />
              <Route path="analytics/revenue" element={<RevenueAnalytics />} />
              <Route path="analytics/geography" element={<Geography />} />
              <Route path="analytics/reports" element={<Reports />} />

              {/* Operations */}
              <Route path="operations/support" element={<Support />} />
              <Route path="operations/notifications" element={<Notifications />} />
              <Route path="operations/broadcasts" element={<BroadcastCampaigns />} />
              <Route path="operations/cms" element={<Cms />} />
              <Route path="operations/cms/editor" element={<CMSEditor />} />

              {/* Security */}
              <Route path="security/dashboard" element={<SecurityDashboard />} />
              <Route path="security/audit" element={<AuditLogs />} />
              <Route path="security/retention" element={<DataRetention />} />
              <Route path="security/requests" element={<DataRequests />} />
              <Route path="security/abuse" element={<AbuseMonitoring />} />
              <Route path="security/fraud" element={<FraudAutoActions />} />

              {/* System */}
              <Route path="system/admins" element={<AdminUsers />} />
              <Route path="system/admins/:id" element={<AdminDetail />} />
              <Route path="system/roles" element={<Roles />} />
              <Route path="system/infrastructure" element={<Infrastructure />} />
              <Route path="system/gpu" element={<GpuMonitoring />} />
              <Route path="system/incidents" element={<Incidents />} />
              <Route path="system/maintenance" element={<MaintenanceScheduler />} />
              <Route path="system/webhooks" element={<WebhooksAndJobs />} />
              <Route path="system/settings" element={<Settings />} />
              <Route path="system/integrations" element={<Integrations />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
