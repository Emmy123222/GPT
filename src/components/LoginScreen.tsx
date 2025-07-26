import React from 'react';
import { LogIn, Shield, Zap, Users } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  loading: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, loading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PrivateICP Messenger</h1>
          <p className="text-slate-300">Secure, AI-enhanced messaging on ICP</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-white">End-to-end encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-white">AI-powered features</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white">Decentralized on ICP</span>
            </div>
          </div>

          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login with Internet Identity</span>
              </>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            No personal data is stored. Your identity remains private.
          </p>
        </div>
      </div>
    </div>
  );
};