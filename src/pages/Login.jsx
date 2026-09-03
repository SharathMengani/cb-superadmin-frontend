import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@chatbucket.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard/overview" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(email, password);
      nav("/dashboard/overview");
    } catch (e2) {
      setErr(typeof e2.response?.data?.detail === "string" ? e2.response.data.detail : "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center p-6">
      {/* Ambient orbs */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, hsl(262 83% 62% / 0.6), transparent 70%)" }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, hsl(280 75% 55% / 0.6), transparent 70%)" }} />

      <div className="relative w-full max-w-md" data-testid="login-page">
        <div className="glass-card rounded-3xl p-8 glow-primary">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">ChatBucket</div>
              <div className="text-[11px] tracking-widest text-muted-foreground uppercase">Business Admin</div>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-1.5">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your Super Admin account to continue.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="login-email-input"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="login-password-input"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {err && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2" data-testid="login-error">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="w-full h-11 rounded-lg btn-gradient font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground">
            <div>Demo credentials pre-filled — <span className="text-foreground">admin@chatbucket.com</span> / <span className="text-foreground">Admin@123</span></div>
          </div>
        </div>
        <div className="mt-4 text-center text-[11px] text-muted-foreground">
          ChatBucket Business Super Admin © 2025
        </div>
      </div>
    </div>
  );
}
