import TabHeader from '../components/TabHeader.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function TabLayout({ subtitle, children }) {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen">
      <TabHeader subtitle={subtitle} />
      <main className="flex-1 flex flex-col relative w-full pt-32 pb-28 bg-surface">{children}</main>
      <BottomNav />
    </div>
  );
}
