import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { CheckCircle, Clock, AlertCircle, ListTodo, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await dashboardService.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.statistics.total_tasks || 0,
      icon: ListTodo,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Belum Dimulai',
      value: stats?.statistics.not_started || 0,
      icon: Clock,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Sedang Dikerjakan',
      value: stats?.statistics.in_progress || 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Selesai',
      value: stats?.statistics.completed || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Terlambat',
      value: stats?.statistics.overdue || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const teamActivity = stats?.team_activity || [];
  const totalPages = Math.ceil(teamActivity.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = teamActivity.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Team Activity</h2>
        </div>
        {teamActivity.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anggota Tim
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tasks
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Selesai
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ongoing
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((member, index) => {
                    const total = member.total_tasks;
                    const completed = member.completed_tasks;
                    const inProgress = member.ongoing_tasks;
                    const completionRate = total > 0 
                      ? Math.round((completed * 100 + inProgress * 50) / total) 
                      : 0;

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                              {member.assigned_to.charAt(0).toUpperCase()}
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {member.assigned_to}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">
                          {total}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {completed}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {inProgress}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {completionRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">Belum ada data aktivitas tim</p>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        
        {stats?.recent_activities && stats.recent_activities.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_activities.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.task_title}</span>
                    {' '}status berubah dari{' '}
                    <span className="font-medium text-gray-600">{activity.old_status || 'Baru'}</span>
                    {' '}ke{' '}
                    <span className="font-medium text-blue-600">{activity.new_status}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Oleh {activity.changed_by} • {new Date(activity.changed_at).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Belum ada aktivitas terbaru</p>
        )}
      </div>
    </div>
  );
}