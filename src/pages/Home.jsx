import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { Plus, LogOut, LayoutDashboard, ListTodo } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import TaskHistory from '../components/TaskHistory';

export default function Home() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    assigned_to: ''
  });

  useEffect(() => {
    if (activeTab === 'tasks') {
      loadTasks();
    }
  }, [activeTab, filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(filters);
      if (response.success) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask.id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      setShowForm(false);
      setSelectedTask(null);
      loadTasks();
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Gagal menyimpan task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Gagal menghapus task');
    }
  };

  const handleClearFilters = () => {
    setFilters({ status: '', assigned_to: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Team Task Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Selamat datang, {user?.full_name}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ListTodo className="w-5 h-5" />
              <span>Tasks</span>
            </button>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Semua Tasks ({tasks.length})
              </h2>
              <button
                onClick={handleCreateTask}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Buat Task Baru</span>
              </button>
            </div>
            <TaskFilter
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onViewHistory={setShowHistory}
              />
            )}
          </div>
        )}
      </main>
      {showForm && (
        <TaskForm
          task={selectedTask}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setShowForm(false);
            setSelectedTask(null);
          }}
        />
      )}
      {showHistory && (
        <TaskHistory
          taskId={showHistory}
          onClose={() => setShowHistory(null)}
        />
      )}
    </div>
  );
}
