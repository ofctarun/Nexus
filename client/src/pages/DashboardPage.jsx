import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser, selectUserRole } from '../features/auth/authSlice';
<<<<<<< HEAD
import { MessageSquare, Mic, Folder, Users, Settings } from 'lucide-react';

const ActionCard = ({ title, description, link, icon: Icon, iconBg, btnBg, btnText, topArrow }) => (
  <Link to={link} className="flex flex-col bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative group h-full">
    
    <div className="flex justify-between items-start mb-8">
      <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center ${iconBg}`}>
        <Icon size={24} strokeWidth={1.5} className="text-current" />
      </div>
      {topArrow && <span className="text-navy-900 opacity-50">&rarr;</span>}
    </div>
    
    <h3 className="text-2xl font-bold text-navy-900 mb-3">{title}</h3>
    <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
      {description}
    </p>

    <div className="mt-auto flex">
      <span className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white ${btnBg} transition-colors group-hover:opacity-90`}>
        {btnText} &rarr;
      </span>
    </div>
  </Link>
);
=======
import { MessageSquare, Mic, Folder } from 'lucide-react';
>>>>>>> 340e0d188a7f2797d084bf011c5df4feca45c5ab

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);

  const startChatCard = {
    title: "Start Chat",
    description: "Begin a new conversation with Nexus and get instant answers from your organization documents.",
    link: "/chat",
    icon: MessageSquare,
    iconBg: "bg-sky-200 text-navy-900",
    btnBg: "bg-navy-900",
    btnText: "Start Chat"
  };

  const fileManagerCard = {
    title: "File Manager",
    description: "Browse everything you've uploaded so far and keep your knowledge base organized.",
    link: "/documents",
    icon: Folder,
    iconBg: "bg-navy-900 text-white",
    btnBg: "bg-emerald-500",
    btnText: "View Files",
    topArrow: true
  };

  const voiceAssistantCard = {
    title: "Voice Assistant",
    description: "Use your voice to interact with Nexus and get hands-free help instantly.",
    link: "/voice",
    icon: Mic,
    iconBg: "bg-navy-900 text-white",
    btnBg: "bg-navy-900",
    btnText: "Start Voice"
  };

  const userManagementCard = {
    title: "User Management",
    description: "Manage organization members, control access permissions, and view system audits.",
    link: "/admin",
    icon: Users,
    iconBg: "bg-navy-900 text-white",
    btnBg: "bg-rose-500",
    btnText: "Manage Users"
  };

  const gridClass = role === 'admin'
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1600px] mx-auto animate-[slideUp_1s_ease-out_0.3s_both]"
    : "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto animate-[slideUp_1s_ease-out_0.3s_both]";

  return (
<<<<<<< HEAD
    <div className="w-full h-full min-h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4 md:px-8 pb-12">
      
      {/* Top Center NEXUS Branding */}
      <div className="mb-10 text-center animate-[popIn_0.8s_ease-out_forwards]">
        <h1 
          className="text-6xl md:text-7xl font-bold tracking-widest text-navy-800 drop-shadow-md"
          style={{ fontFamily: '"Smooch Sans", sans-serif' }}
        >
=======
    <div className="space-y-0">
      <div className="flex items-center justify-center py-20">
        <h1 className="text-8xl font-black uppercase tracking-[0.2em] text-[#223959]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
>>>>>>> 340e0d188a7f2797d084bf011c5df4feca45c5ab
          NEXUS
        </h1>
      </div>

<<<<<<< HEAD
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; filter: blur(5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); }
        }
        @keyframes slideUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}} />

      {/* Responsive Boxes */}
      <div className={gridClass}>
        <ActionCard {...startChatCard} />
        <ActionCard {...fileManagerCard} />
        <ActionCard {...voiceAssistantCard} />
        {role === 'admin' && <ActionCard {...userManagementCard} />}
      </div>
      
=======
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
>>>>>>> 340e0d188a7f2797d084bf011c5df4feca45c5ab
    </div>
  );
}