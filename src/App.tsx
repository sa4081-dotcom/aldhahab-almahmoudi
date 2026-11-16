import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { Header } from './components/Header';
import { Storefront } from './components/Storefront';
import { StoreProvider, useStore } from './context/StoreContext';

function AppShell() {
  const { viewMode } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1610]">
      <Header />
      {viewMode === 'store' ? <Storefront /> : <AdminDashboard />}
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
