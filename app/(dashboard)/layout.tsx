import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileNav";
import { AppointmentModalProvider } from "@/components/providers/AppointmentModalContext";
import { NotificationsProvider } from "@/components/providers/NotificationsContext";
import { NewAppointmentModal } from "@/components/appointments/NewAppointmentModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsProvider>
      <AppointmentModalProvider>
        <div className="flex h-screen overflow-hidden" style={{ background: "var(--fd-bg-page)" }}>
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <MobileHeader />
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
        <NewAppointmentModal />
      </AppointmentModalProvider>
    </NotificationsProvider>
  );
}
