import { ArrowLeft, Users, Music, DollarSign, Activity, Settings, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminDashboardPage({ onNavigate, onLogout }: AdminDashboardPageProps) {
  const stats = [
    { title: 'Total Users', value: '1,248', icon: Users, change: '+12%' },
    { title: 'Total Songs', value: '8,432', icon: Music, change: '+5%' },
    { title: 'Monthly Revenue', value: '$45,231', icon: DollarSign, change: '+18%' },
    { title: 'Active Sessions', value: '342', icon: Activity, change: '-2%' },
  ];

  const recentUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', status: 'Active', joinDate: '2026-03-20' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', status: 'Active', joinDate: '2026-03-19' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', status: 'Inactive', joinDate: '2026-03-18' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', status: 'Active', joinDate: '2026-03-15' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', status: 'Pending', joinDate: '2026-03-14' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-serif text-[#3E2723] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-[#654321] italic">Welcome back, Administrator</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => onNavigate('landing')}
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Home
            </Button>
            <Button
              onClick={onLogout}
              className="bg-red-700 text-white hover:bg-red-800 border-none flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-[#D4A574]/20 flex items-center justify-between hover:shadow-lg transition-shadow">
              <div>
                <p className="text-sm font-bold text-[#654321] uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-[#3E2723]">{stat.value}</h3>
                <p className={`text-sm mt-2 font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#8B4513]/10 text-[#8B4513] flex items-center justify-center">
                <stat.icon size={28} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-2xl shadow-md border border-[#D4A574]/20 overflow-hidden mb-10">
          <div className="p-6 border-b border-[#D4A574]/20 flex justify-between items-center bg-[#FAF7F0]/50">
            <h2 className="text-2xl font-bold text-[#3E2723]">Recent Registered Users</h2>
            <Button className="bg-[#8B4513] text-white hover:bg-[#654321] text-sm py-2">View All Users</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#8B4513]/5 text-[#8B4513] uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Join Date</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4A574]/20">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAF7F0]/50 transition-colors">
                    <td className="p-4 font-bold text-[#3E2723]">{user.name}</td>
                    <td className="p-4 text-[#654321]">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#654321]">{user.joinDate}</td>
                    <td className="p-4 text-center">
                      <button className="text-[#8B4513] hover:text-[#3E2723] transition-colors p-2 bg-[#8B4513]/10 rounded-lg hover:bg-[#8B4513]/20">
                        <Settings size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
