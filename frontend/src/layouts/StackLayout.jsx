import StackHeader from '../components/StackHeader.jsx';

export default function StackLayout({ title, backTo, children }) {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen">
      <StackHeader title={title} backTo={backTo} />
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-safe bg-surface">{children}</main>
    </div>
  );
}
