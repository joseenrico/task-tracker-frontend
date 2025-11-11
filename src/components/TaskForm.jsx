import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import {
  Cross2Icon,
  CalendarIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FileTextIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../utils/constants';

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'Not_Started',
    priority: 'Medium',
    start_date: '',
    due_date: '',
    change_reason: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        status: task.status || 'Not_Started',
        priority: task.priority || 'Medium',
        start_date: task.start_date || '',
        due_date: task.due_date || '',
        change_reason: ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Judul task harus diisi';
    }
    if (!formData.assigned_to.trim()) {
      newErrors.assigned_to = 'Assignee harus diisi';
    }
    if (formData.due_date && formData.start_date && new Date(formData.due_date) < new Date(formData.start_date)) {
      newErrors.due_date = 'Deadline tidak boleh sebelum tanggal mulai';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-gray-600 bg-gray-100 border-gray-300',
      'Medium': 'text-blue-600 bg-blue-100 border-blue-300',
      'High': 'text-orange-600 bg-orange-100 border-orange-300',
      'Urgent': 'text-red-600 bg-red-100 border-red-300'
    };
    return colors[priority] || colors.Medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not_Started': 'text-gray-600 bg-gray-100 border-gray-300',
      'In_Progress': 'text-blue-600 bg-blue-100 border-blue-300',
      'Completed': 'text-green-600 bg-green-100 border-green-300',
      'On_Hold': 'text-yellow-600 bg-yellow-100 border-yellow-300'
    };
    return colors[status] || colors.Not_Started;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-gray-200/60 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {task ? 'Edit Task' : 'Buat Task Baru'}
              </h2>
              <p className="text-sm text-gray-600">
                {task ? 'Update detail task yang sudah ada' : 'Buat task baru untuk tim Anda'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <FileTextIcon className="w-4 h-4" />
              <span>Judul Task <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Masukkan judul task yang jelas dan deskriptif"
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <FileTextIcon className="w-4 h-4" />
              <span>Deskripsi Task</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Jelaskan detail task, requirements, atau instruksi khusus..."
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <PersonIcon className="w-4 h-4" />
                <span>Ditugaskan Kepada <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.assigned_to ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Nama anggota tim"
                />
              </div>
              {errors.assigned_to && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>{errors.assigned_to}</span>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Prioritas</span>
              </label>
              <Select.Root 
                value={formData.priority} 
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white flex items-center justify-between">
                  <Select.Value placeholder="Pilih prioritas" />
                  <Select.Icon className="text-gray-400">
                    <ChevronDownIcon className="w-4 h-4" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content 
                    className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    position="popper"
                    sideOffset={4}
                  >
                    <Select.Viewport className="p-1">
                      {TASK_PRIORITY_OPTIONS.map(option => (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100"
                        >
                          <Select.ItemText>{option.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <ClockIcon className="w-4 h-4" />
                <span>Status</span>
              </label>
              <Select.Root 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white flex items-center justify-between">
                  <Select.Value placeholder="Pilih status" />
                  <Select.Icon className="text-gray-400">
                    <ChevronDownIcon className="w-4 h-4" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content 
                    className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    position="popper"
                    sideOffset={4}
                  >
                    <Select.Viewport className="p-1">
                      {TASK_STATUS_OPTIONS.map(option => (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100"
                        >
                          <Select.ItemText>{option.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Tanggal Mulai</span>
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={today}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Deadline</span>
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    min={formData.start_date || today}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.due_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.due_date && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span>{errors.due_date}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          {task && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Alasan Perubahan (Opsional)
              </label>
              <input
                type="text"
                name="change_reason"
                value={formData.change_reason}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Jelaskan alasan perubahan task..."
              />
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Task</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs border ${getStatusColor(formData.status)}`}>
                  {TASK_STATUS_OPTIONS.find(s => s.value === formData.status)?.label}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Prioritas:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs border ${getPriorityColor(formData.priority)}`}>
                  {TASK_PRIORITY_OPTIONS.find(p => p.value === formData.priority)?.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{task ? 'Update Task' : 'Buat Task'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}