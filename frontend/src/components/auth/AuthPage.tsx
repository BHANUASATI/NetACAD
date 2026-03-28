import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogIn, User, Lock, Eye, EyeOff, BookOpen, GraduationCap, Users, Award, Sparkles, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, state } = useApp();
  const [isFaculty, setIsFaculty] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const universityEmailRegex = /^[a-zA-Z0-9._%+-]+@university\.edu\.in$/;
    return universityEmailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear email error when user starts typing
    if (name === 'email') {
      setEmailError('');
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setEmailError('Only university email addresses ending with @university.edu.in are allowed');
      return;
    }
    
    await login(formData.email, formData.password, isFaculty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <Sparkles className="w-2 h-2 text-white opacity-30" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Branding and Features */}
          <div className="text-white space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-glow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AcadDNA
                  </h1>
                  <p className="text-purple-200">A Game Changer</p>
                </div>
              </div>
              
              <h2 className="text-5xl font-bold leading-tight">
                Your Academic
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Workflow System
                </span>
              </h2>
              
              <p className="text-xl text-purple-100 leading-relaxed">
                Transform your university journey with smart task automation, deadline tracking, and academic guidance.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <GraduationCap className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Smart Academic Engine</h3>
                  <p className="text-sm text-purple-200">Auto-generates tasks based on your degree requirements</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Users className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Multi-Role Access</h3>
                  <p className="text-sm text-purple-200">Student, Faculty & Admin dashboards</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Award className="w-5 h-5 text-pink-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Placement Integration</h3>
                  <p className="text-sm text-purple-200">Internship opportunities and application tracking</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">1247+</div>
                <div className="text-sm text-purple-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300">8432+</div>
                <div className="text-sm text-purple-200">Tasks Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-300">78.5%</div>
                <div className="text-sm text-purple-200">Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="animate-slide-in-right">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-glow mb-4">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-purple-200 mt-2">Sign in to access your academic dashboard</p>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setIsFaculty(false)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    !isFaculty
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Student
                </button>
                <button
                  onClick={() => setIsFaculty(true)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isFaculty
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Official Login
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-purple-200">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-purple-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
                        emailError 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/20 focus:ring-blue-500'
                      }`}
                      placeholder={isFaculty ? "staff@university.edu.in" : "student@university.edu.in"}
                    />
                  </div>
                  {emailError && (
                    <div className="flex items-center space-x-2 text-red-300 text-sm">
                      <User className="w-4 h-4" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-purple-200">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {state.error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm text-red-200">{state.error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state.loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2"
                >
                  {state.loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in as {isFaculty ? 'Official' : 'Student'} Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .shadow-glow {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
};
