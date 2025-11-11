// src/components/TaskFilter.jsx
import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import {
  MixerHorizontalIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../utils/constants';

export default function TaskFilter({ filters, onFilterChange, onClearFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters = filters.status || filters.assigned_to || filters.priority || filters.dateRange;

  const statusColors = {
    'Not_Started': 'bg-gray-100 text-gray-800 border-gray-300',
    'In_Progress': 'bg-blue-100 text-blue-800 border-blue-300',
    'Completed': 'bg-green-100 text-green-800 border-green-300',
    'On_Hold': 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const priorityColors = {
    'Low': 'bg-gray-100 text-gray-800 border-gray-300',
    'Medium': 'bg-blue-100 text-blue-800 border-blue-300',
    'High': 'bg-orange-100 text-orange-800 border-orange-300',
    'Urgent': 'bg-red-100 text-red-800 border-red-300'
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onClearFilters();
    setIsExpanded(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.assigned_to) count++;
    if (filters.priority) count++;
    if (filters.dateRange) count++;
    return count;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <MixerHorizontalIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <p className="text-sm text-gray-600">Saring tasks berdasarkan kriteria</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{getActiveFilterCount()} active</span>
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              >
                <Cross2Icon className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
          >
            <MixerHorizontalIcon className="w-4 h-4" />
            <span>{isExpanded ? 'Hide' : 'Show'}</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Status Quick Filters */}
        {TASK_STATUS_OPTIONS.slice(0, 4).map(option => (
          <button
            key={option.value}
            onClick={() => handleFilterChange('status', 
              filters.status === option.value ? '' : option.value
            )}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
              filters.status === option.value 
                ? statusColors[option.value] || 'bg-blue-100 text-blue-800 border-blue-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              filters.status === option.value 
                ? 'bg-current' 
                : option.value === 'Completed' ? 'bg-green-500' :
                  option.value === 'In_Progress' ? 'bg-blue-500' :
                  option.value === 'On_Hold' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable Filter Form */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Search by Assignee */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
              Cari Anggota
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.assigned_to || ''}
                onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                placeholder="Nama anggota..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status Task
            </label>
            <Select.Root 
              value={filters.status || ''} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <Select.Trigger className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white flex items-center justify-between">
                <Select.Value placeholder="Semua Status" />
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tingkat Prioritas
            </label>
            <Select.Root 
              value={filters.priority || ''} 
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <Select.Trigger className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white flex items-center justify-between">
                <Select.Value placeholder="Semua Prioritas" />
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Rentang Tanggal
            </label>
            <Select.Root 
              value={filters.dateRange || ''} 
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <Select.Trigger className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white flex items-center justify-between">
                <Select.Value placeholder="Semua Waktu" />
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
                    <Select.Item value="today" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100">
                      <Select.ItemText>Hari Ini</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="tomorrow" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100">
                      <Select.ItemText>Besok</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="week" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100">
                      <Select.ItemText>Minggu Ini</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="next_week" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100">
                      <Select.ItemText>Minggu Depan</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="month" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100">
                      <Select.ItemText>Bulan Ini</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="overdue" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 outline-none cursor-pointer data-[highlighted]:bg-gray-100">
                      <Select.ItemText>Terlambat</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.status && (
                <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm border ${statusColors[filters.status]}`}>
                  <span>Status: {TASK_STATUS_OPTIONS.find(s => s.value === filters.status)?.label}</span>
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="hover:text-current"
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.assigned_to && (
                <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-300">
                  <span>Assignee: {filters.assigned_to}</span>
                  <button
                    onClick={() => handleFilterChange('assigned_to', '')}
                    className="hover:text-current"
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.priority && (
                <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm border ${priorityColors[filters.priority]}`}>
                  <span>Priority: {TASK_PRIORITY_OPTIONS.find(p => p.value === filters.priority)?.label}</span>
                  <button
                    onClick={() => handleFilterChange('priority', '')}
                    className="hover:text-current"
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateRange && (
                <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-300">
                  <span>Date: {filters.dateRange}</span>
                  <button
                    onClick={() => handleFilterChange('dateRange', '')}
                    className="hover:text-current"
                  >
                    <Cross2Icon className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}