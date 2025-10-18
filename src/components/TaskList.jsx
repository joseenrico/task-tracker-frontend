import { useState } from 'react';
import { Edit2, Trash2, Calendar, User, AlertTriangle } from 'lucide-react';
import { formatDate, getStatusLabel, getStatusColor, getPriorityLabel, getPriorityColor } from '../utils/constants';
import Button from './ui/Button';

export default function TaskList({ tasks, onEdit, onDelete, onViewHistory }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (taskId) => {
    onDelete(taskId);
    setDeleteConfirm(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Tidak ada task yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => {
        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed';
        return (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                {task.title}
              </h3>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(task.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`${getStatusColor(task.status)} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
                {getStatusLabel(task.status)}
              </span>
              <span className={`${getPriorityColor(task.priority)} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{task.assigned_to}</span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {task.due_date ? formatDate(task.due_date) : 'Tidak ada deadline'}
              </span>
              {isOverdue && (
                <span className="text-xs text-red-600 font-medium">Terlambat!</span>
              )}
            </div>
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => onViewHistory(task.id)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lihat History
              </button>
            </div>
            {deleteConfirm === task.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-sm mx-4 animate-slide-up">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hapus Task?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Apakah Anda yakin ingin menghapus task "{task.title}"? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setDeleteConfirm(null)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={() => handleDelete(task.id)}
                      variant='danger'
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
