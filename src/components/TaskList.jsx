import { useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import {
  Pencil2Icon,
  TrashIcon,
  CalendarIcon,
  PersonIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
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
          <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                {task.title}
              </h3>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <Pencil2Icon className="w-4 h-4" />
                </button>
                <AlertDialog.Root open={deleteConfirm === task.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                  <AlertDialog.Trigger asChild>
                    <button
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete"
                      onClick={() => setDeleteConfirm(task.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 animate-fade-in" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 max-w-sm w-full mx-4 animate-slide-up focus:outline-none">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                          Hapus Task?
                        </AlertDialog.Title>
                      </div>
                      <AlertDialog.Description className="text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus task "{task.title}"? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialog.Description>
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <AlertDialog.Cancel asChild>
                          <Button
                            variant="secondary"
                            className="flex-1"
                          >
                            Batal
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <Button
                            onClick={() => handleDelete(task.id)}
                            variant="danger"
                            className="flex-1"
                          >
                            Hapus
                          </Button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
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
              <PersonIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">{task.assigned_to}</span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {task.due_date ? formatDate(task.due_date) : 'Tidak ada deadline'}
              </span>
              {isOverdue && (
                <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">Terlambat!</span>
              )}
            </div>
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => onViewHistory(task.id)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Lihat History
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}