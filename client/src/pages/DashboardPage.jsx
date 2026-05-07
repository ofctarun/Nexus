import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser, selectUserRole } from '../features/auth/authSlice';
import { MessageSquare, Mic, Folder } from 'lucide-react';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);
  const isMember = role === 'member';

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-center py-20">
        <h1 className="text-8xl font-black uppercase tracking-[0.2em] text-[#223959]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          NEXUS
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Link
          to="/chat"
          className="group relative overflow-hidden rounded-[32px] border border-[#9acee2]/20 bg-white/90 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[#9acee2]/40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#9acee2] text-[#223959] shadow-sm transition group-hover:bg-[#1fab78] group-hover:text-white">
              <MessageSquare size={26} />
            </div>
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[#223959] text-lg">→</span>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#223959]">Start Chat</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Begin a new conversation with Nexus and get instant answers from your organization documents.</p>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center rounded-full bg-[#223959] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#1fab78]">
              Start Chat →
            </span>
          </div>
        </Link>

        <Link
          to="/documents"
          className="group relative overflow-hidden rounded-[32px] border border-[#9acee2]/20 bg-white/90 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[#9acee2]/40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#1fab78] text-white shadow-sm transition group-hover:bg-[#223959]">
              <Folder size={26} />
            </div>
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[#223959] text-lg">→</span>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#223959]">File Manager</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Browse everything you've uploaded so far and keep your knowledge base organized.</p>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center rounded-full bg-[#223959] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#1fab78]">
              View Files →
            </span>
          </div>
        </Link>

        <Link
          to="/voice"
          className="group relative overflow-hidden rounded-[32px] border border-[#9acee2]/20 bg-white/90 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[#9acee2]/40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#223959] text-white shadow-sm transition group-hover:bg-[#9acee2] group-hover:text-[#223959]">
              <Mic size={26} />
            </div>
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[#223959] text-lg">→</span>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#223959]">Voice Assistant</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Use your voice to interact with Nexus and get hands-free help instantly.</p>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center rounded-full bg-[#223959] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#9acee2] group-hover:text-[#223959]">
              Start Voice →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}