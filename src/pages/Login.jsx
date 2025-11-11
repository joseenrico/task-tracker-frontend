import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import * as Form from '@radix-ui/react-form';
import {
  LockClosedIcon,
  PersonIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import PulseLogo from '../assets/pulse_logo.png';
import Button from '../components/ui/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) navigate('/');
      else setError(result.message || 'Login gagal. Periksa username dan password Anda.');
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800"
      >
        <div className="text-center mb-8">
          <motion.img
            src={PulseLogo}
            alt="Pulse Logo"
            className="w-32 h-32 mx-auto mb-4"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Pulse
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Team Task Tracker Login
          </p>
        </div>
        <Form.Root onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start space-x-3 bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 rounded-xl p-3"
            >
              <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
          <Form.Field name="username" className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </Form.Label>
            <div className="relative">
              <PersonIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Form.Control asChild>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan username"
                  required
                />
              </Form.Control>
            </div>
            <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
              Username wajib diisi
            </Form.Message>
          </Form.Field>
          <Form.Field name="password" className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Form.Label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Form.Control asChild>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password"
                  required
                />
              </Form.Control>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeClosedIcon className="w-5 h-5" />
                ) : (
                  <EyeOpenIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
              Password wajib diisi
            </Form.Message>
          </Form.Field>
          <div className="pt-2">
            <Form.Submit asChild>
              <Button
                type="submit"
                variant="primary"
                className={`w-full flex items-center justify-center gap-2 py-3 text-base rounded-xl font-semibold ${
                  loading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </Form.Submit>
          </div>
        </Form.Root>

        <p className="text-center text-sm text-gray-400 mt-8">
          © {new Date().getFullYear()} Pulse - Team Task Tracker
        </p>
      </motion.div>
    </div>
  );
}