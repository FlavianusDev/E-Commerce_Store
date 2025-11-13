import React, { useState } from 'react';
import { SignUpData, AuthProvider } from '../types';
import { GoogleIcon, GitHubIcon } from '../constants';


interface SignUpPageProps {
  onSignUp: (data: SignUpData) => Promise<boolean>;
  onSocialSignUp: (provider: AuthProvider) => void;
  onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSocialSignUp, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    shippingAddress: '',
    isSeller: false,
    storeName: '',
    storeDescription: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const { confirmPassword, ...signUpData } = formData;
    const success = await onSignUp({ ...signUpData, authProvider: 'local' } as SignUpData);
    if (!success) {
      setError('Failed to create account. The username might already be taken.');
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="text-4xl font-bold text-primary">Vian</span>
          <span className="text-4xl font-light text-slate-600">Store</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           <div className="space-y-4">
             <button onClick={() => onSocialSignUp('google')} className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                <GoogleIcon className="w-5 h-5 mr-2" />
                Sign up with Google
            </button>
             <button onClick={() => onSocialSignUp('github')} className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                <GitHubIcon className="w-5 h-5 mr-2" />
                Sign up with GitHub
            </button>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or fill out the form</span></div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            <textarea id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} placeholder="Shipping Address" rows={3} required className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />

            <div className="border-t pt-6 space-y-4">
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="isSeller" name="isSeller" type="checkbox" checked={formData.isSeller} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="isSeller" className="font-medium text-gray-700">I want to sell products</label>
                        <p className="text-gray-500">Sign up as a seller to list your own products on VianStore.</p>
                    </div>
                </div>
                {formData.isSeller && (
                    <div className="space-y-4 animate-fade-in">
                        <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} placeholder="Your Store Name" required={formData.isSeller} className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
                        <textarea id="storeDescription" name="storeDescription" value={formData.storeDescription} onChange={handleChange} placeholder="Short Store Description" rows={2} className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover">
                Create Account
              </button>
            </div>
          </form>
           <div className="text-center mt-4">
                <button onClick={onNavigateToLogin} className="text-sm font-medium text-primary hover:text-primary-hover">
                    Already have an account? Sign In
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;