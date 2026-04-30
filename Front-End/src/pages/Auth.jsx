import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Notification from '../components/Notification';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notif, setNotif] = useState({ show: false, msg: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const bodyData = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();

      if (data.success) {
        setNotif({ show: true, msg: isLogin ? 'Login berhasil!' : 'Registrasi berhasil!' });
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          setTimeout(() => navigate('/'), 1500);
        } else {
          setIsLogin(true);
        }
      } else {
        setNotif({ show: true, msg: data.message || 'Terjadi kesalahan' });
      }
    } catch (error) {
      setNotif({ show: true, msg: 'Gagal menghubungi server' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-10 relative">
      <Notification message={notif.msg} isVisible={notif.show} onClose={() => setNotif({show: false, msg: ''})} />
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1518605368461-1e1e114f51e0?auto=format&fit=crop&q=80&w=2000" 
          alt="Stadium" 
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-gray-50 dark:from-luxury-dark/50 dark:to-luxury-dark backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-luxury-cardDark/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl shadow-luxury-gold/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">
            {isLogin ? 'Selamat Datang' : 'Buat Akun VIP'}
          </h2>
          <p className="text-sm text-gray-500">
            {isLogin ? 'Masuk untuk mengelola reservasi Anda.' : 'Bergabung untuk akses eksklusif.'}
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-2 text-sm font-medium transition-all ${isLogin ? 'border-b-2 border-luxury-gold text-luxury-gold' : 'border-b-2 border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-2 text-sm font-medium transition-all ${!isLogin ? 'border-b-2 border-luxury-gold text-luxury-gold' : 'border-b-2 border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-luxury-gold outline-none" 
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-luxury-gold outline-none" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-luxury-gold outline-none" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-luxury-gold transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:-translate-y-1 hover:shadow-lg transition-all group">
            {isLogin ? 'Masuk ke Arena' : 'Daftar Sekarang'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}