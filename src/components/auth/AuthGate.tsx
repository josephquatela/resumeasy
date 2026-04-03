import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export function AuthGate() {
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await signInWithEmail(email.trim());
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-1">Resumeasy</h1>
        <p className="text-zinc-400 text-sm mb-6">Your resume, your rules. No paywalls.</p>

        {sent ? (
          <div className="text-sm text-green-400 bg-green-950/50 border border-green-800 rounded px-3 py-2">
            Check your email for a magic link!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-500 w-full focus:outline-none focus:border-zinc-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded px-4 py-2 font-medium transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
