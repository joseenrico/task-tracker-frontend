import { useState, useEffect } from 'react';
import {
  Cross2Icon,
  ClockIcon,
  ArrowRightIcon,
} from '@radix-ui/react-icons';
import { taskService } from '../services/taskService';
import { formatDateTime, getStatusLabel } from '../utils/constants';

export default function TaskHistory({ taskId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [taskId]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTaskLogs(taskId);
      if (response.success) {
        setLogs(response.data);
      }
    } catch (err) {
      setError('Gagal memuat history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Task History</h2>
              <p className="text-sm text-gray-600">Riwayat perubahan status task</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
            aria-label="Tutup"
          >
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <Cross2Icon className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <ClockIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Belum ada history untuk task ini</p>
                <p className="text-sm text-gray-400">Perubahan status akan muncul di sini</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  className="relative pl-8 pb-4"
                >
                  {index !== logs.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200/60 hover:border-gray-300 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                      {log.old_status && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded-md border border-gray-300">
                            {getStatusLabel(log.old_status)}
                          </span>
                          <ArrowRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                        {getStatusLabel(log.new_status)}
                      </span>
                    </div>
                    {log.change_reason && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Alasan Perubahan:</p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-md border border-gray-200">
                          {log.change_reason}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3 flex-shrink-0" />
                      <span>{formatDateTime(log.changed_at)}</span>
                      {log.changed_by && (
                        <>
                          <span>•</span>
                          <span>Oleh: {log.changed_by}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}