export const TASK_STATUS = {
  NOT_STARTED: 'Not_Started',
  IN_PROGRESS: 'In_Progress',
  COMPLETED: 'Completed'
};

export const TASK_STATUS_OPTIONS = [
  { value: 'Not_Started', label: 'Belum Dimulai', color: 'bg-gray-500' },
  { value: 'In_Progress', label: 'Sedang Dikerjakan', color: 'bg-blue-500' },
  { value: 'Completed', label: 'Selesai', color: 'bg-green-500' }
];

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

export const TASK_PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'bg-gray-400' },
  { value: 'Medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'High', label: 'High', color: 'bg-red-500' }
];

export const getStatusLabel = (status) => {
  const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
  return option ? option.label : status;
};

export const getStatusColor = (status) => {
  const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
  return option ? option.color : 'bg-gray-500';
};

export const getPriorityLabel = (priority) => {
  const option = TASK_PRIORITY_OPTIONS.find(opt => opt.value === priority);
  return option ? option.label : priority;
};

export const getPriorityColor = (priority) => {
  const option = TASK_PRIORITY_OPTIONS.find(opt => opt.value === priority);
  return option ? option.color : 'bg-gray-400';
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};