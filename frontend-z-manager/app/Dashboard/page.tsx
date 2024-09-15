import { FiPackage, FiList, FiClock, FiImage } from 'react-icons/fi';
import { ReactNode } from 'react';

export default function Dashboard() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <DashboardCard icon={<FiPackage />} title="Total Buckets" value="12" />
            <DashboardCard icon={<FiList />} title="Total Bucket Items" value="156" />
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Most Recent Bucket</h2>
            {/* Add your most recent bucket component here */}
            <p>Most recent bucket details go here...</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Dynamic Picture</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200/30 rounded-lg flex items-center justify-center">
            {/* <FiImage className="text-4xl text-black" /> */}
          </div>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* Add your activity list or chart component here */}
        <p>Activity data goes here...</p>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xl text-white">{icon}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
      <div className="text-sm text-white">{title}</div>
    </div>
  );
}