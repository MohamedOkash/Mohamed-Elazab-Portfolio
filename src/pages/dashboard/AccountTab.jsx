import { useState, useEffect } from 'react';
import { Mail, Lock, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/firebaseEnv';

export default function AccountTab({ isRTL }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for Change Email
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState({ type: '', message: '' });
  const [emailLoading, setEmailLoading] = useState(false);

  // States for Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // States for Password Reset Email
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      if (isFirebaseConfigured) {
        try {
          const { getAuthClient } = await import('../../firebase/authClient');
          const auth = await getAuthClient();
          if (auth && active) {
            setCurrentUser(auth.currentUser);
          }
        } catch (err) {
          console.error("Error fetching current user:", err);
        } finally {
          if (active) setLoading(false);
        }
      } else {
        // Simulated local user
        if (active) {
          setCurrentUser({
            email: localStorage.getItem('elazab_demo_email_val') || 'admin@elazabphotography.com'
          });
          setLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  const handleReauthenticate = async (password) => {
    if (!isFirebaseConfigured) return true;
    const { getAuthClient } = await import('../../firebase/authClient');
    const auth = await getAuthClient();
    if (!auth || !auth.currentUser) throw new Error("No user logged in");

    const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
    return true;
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) {
      setEmailStatus({
        type: 'error',
        message: isRTL ? 'الرجاء إدخال البريد الإلكتروني الجديد.' : 'Please enter the new email address.'
      });
      return;
    }

    setEmailLoading(true);
    setEmailStatus({ type: '', message: '' });

    try {
      if (isFirebaseConfigured) {
        // Reauthenticate first
        try {
          await handleReauthenticate(emailPassword);
        } catch {
          throw new Error(isRTL ? 'كلمة المرور الحالية غير صحيحة.' : 'Incorrect current password.');
        }

        const { getAuthClient } = await import('../../firebase/authClient');
        const auth = await getAuthClient();
        const { updateEmail } = await import('firebase/auth');
        
        await updateEmail(auth.currentUser, newEmail);
        setCurrentUser({ ...auth.currentUser });
      } else {
        // Demo mode simulation
        if (emailPassword !== 'admin') {
          throw new Error(isRTL ? 'كلمة المرور الحالية غير صحيحة (الباسورد الافتراضي هو admin).' : 'Incorrect current password (default is admin).');
        }
        localStorage.setItem('elazab_demo_email_val', newEmail);
        setCurrentUser({ email: newEmail });
      }

      setEmailStatus({
        type: 'success',
        message: isRTL ? 'تم تحديث البريد الإلكتروني بنجاح!' : 'Email address updated successfully!'
      });
      setNewEmail('');
      setEmailPassword('');
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.message || (isRTL ? 'حدث خطأ أثناء تحديث البريد الإلكتروني.' : 'Failed to update email address.')
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({
        type: 'error',
        message: isRTL ? 'الرجاء ملء جميع حقول كلمة المرور.' : 'Please fill all password fields.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        message: isRTL ? 'كلمتا المرور الجديدتان غير متطابقتين.' : 'New passwords do not match.'
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({
        type: 'error',
        message: isRTL ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.' : 'Password must be at least 6 characters.'
      });
      return;
    }

    setPasswordLoading(true);
    setPasswordStatus({ type: '', message: '' });

    try {
      if (isFirebaseConfigured) {
        // Reauthenticate first
        try {
          await handleReauthenticate(currentPassword);
        } catch {
          throw new Error(isRTL ? 'كلمة المرور الحالية غير صحيحة.' : 'Incorrect current password.');
        }

        const { getAuthClient } = await import('../../firebase/authClient');
        const auth = await getAuthClient();
        const { updatePassword } = await import('firebase/auth');
        
        await updatePassword(auth.currentUser, newPassword);
      } else {
        // Demo mode simulation
        if (currentPassword !== 'admin') {
          throw new Error(isRTL ? 'كلمة المرور الحالية غير صحيحة (الباسورد الافتراضي هو admin).' : 'Incorrect current password (default is admin).');
        }
      }

      setPasswordStatus({
        type: 'success',
        message: isRTL ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus({
        type: 'error',
        message: err.message || (isRTL ? 'حدث خطأ أثناء تحديث كلمة المرور.' : 'Failed to update password.')
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!currentUser?.email) return;

    setResetLoading(true);
    setResetStatus({ type: '', message: '' });

    try {
      if (isFirebaseConfigured) {
        const { getAuthClient } = await import('../../firebase/authClient');
        const auth = await getAuthClient();
        const { sendPasswordResetEmail } = await import('firebase/auth');
        await sendPasswordResetEmail(auth, currentUser.email);
      }
      
      setResetStatus({
        type: 'success',
        message: isRTL 
          ? `تم إرسال رابط إعادة التعيين إلى البريد الإلكتروني: ${currentUser.email}` 
          : `A password reset link has been sent to: ${currentUser.email}`
      });
    } catch (err) {
      setResetStatus({
        type: 'error',
        message: err.message || (isRTL ? 'حدث خطأ أثناء إرسال البريد الإلكتروني.' : 'Failed to send password reset email.')
      });
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <RefreshCw className="animate-spin text-theme-accent" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h3 className="text-lg font-light text-theme-accent border-b border-zinc-900 pb-3" style={{ fontFamily: 'serif' }}>
        {isRTL ? "إعدادات الحساب والأمان" : "Account & Security Settings"}
      </h3>

      {/* Info Banner */}
      <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">
            {isRTL ? "حساب المسؤول الحالي" : "Current Administrator Email"}
          </span>
          <span className="text-sm font-medium text-white mt-1 block">
            {currentUser?.email || "unknown@elazabphotography.com"}
          </span>
        </div>

        <button
          onClick={handleSendResetEmail}
          disabled={resetLoading}
          className="border border-zinc-900 hover:border-theme-accent text-zinc-300 hover:text-white px-4 py-2 rounded text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {resetLoading ? <RefreshCw className="animate-spin" size={12} /> : <Mail size={12} />}
          {isRTL ? "إرسال رابط استعادة كلمة المرور" : "Send Password Reset Email"}
        </button>
      </div>

      {resetStatus.message && (
        <div className={`p-4 rounded-lg border text-xs flex items-start gap-2.5 ${
          resetStatus.type === 'success' 
            ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' 
            : 'bg-red-950/20 border-red-900/50 text-red-400'
        }`}>
          {resetStatus.type === 'success' ? <CheckCircle size={14} className="mt-0.5" /> : <AlertCircle size={14} className="mt-0.5" />}
          <span>{resetStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form: Change Email */}
        <form onSubmit={handleUpdateEmail} className="border border-zinc-900 p-6 bg-zinc-950/20 rounded-lg space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-theme-accent font-semibold flex items-center gap-2">
            <Mail size={14} />
            {isRTL ? "تغيير البريد الإلكتروني" : "Update Email Address"}
          </h4>

          {emailStatus.message && (
            <div className={`p-3 rounded border text-xs flex items-start gap-2 ${
              emailStatus.type === 'success' ? 'bg-emerald-950/25 border-emerald-900/40 text-emerald-400' : 'bg-red-950/25 border-red-900/40 text-red-400'
            }`}>
              {emailStatus.type === 'success' ? <CheckCircle size={12} className="mt-0.5" /> : <AlertCircle size={12} className="mt-0.5" />}
              <span>{emailStatus.message}</span>
            </div>
          )}

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
              {isRTL ? "البريد الإلكتروني الجديد" : "New Email Address"}
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
              placeholder="admin@newemail.com"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
              {isRTL ? "كلمة المرور لتأكيد الهوية" : "Password (to verify identity)"}
            </label>
            <input
              type="password"
              required
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={emailLoading}
            className="w-full bg-theme-accent text-black font-semibold py-2 rounded text-xs tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {emailLoading && <RefreshCw className="animate-spin" size={12} />}
            {isRTL ? "حفظ البريد الجديد" : "Save New Email"}
          </button>
        </form>

        {/* Form: Change Password */}
        <form onSubmit={handleUpdatePassword} className="border border-zinc-900 p-6 bg-zinc-950/20 rounded-lg space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-theme-accent font-semibold flex items-center gap-2">
            <Lock size={14} />
            {isRTL ? "تغيير كلمة المرور" : "Change Account Password"}
          </h4>

          {passwordStatus.message && (
            <div className={`p-3 rounded border text-xs flex items-start gap-2 ${
              passwordStatus.type === 'success' ? 'bg-emerald-950/25 border-emerald-900/40 text-emerald-400' : 'bg-red-950/25 border-red-900/40 text-red-400'
            }`}>
              {passwordStatus.type === 'success' ? <CheckCircle size={12} className="mt-0.5" /> : <AlertCircle size={12} className="mt-0.5" />}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
              {isRTL ? "كلمة المرور الحالية" : "Current Password"}
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
              {isRTL ? "كلمة المرور الجديدة" : "New Password"}
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
              {isRTL ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full bg-theme-accent text-black font-semibold py-2 rounded text-xs tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {passwordLoading && <RefreshCw className="animate-spin" size={12} />}
            {isRTL ? "تحديث كلمة المرور" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
