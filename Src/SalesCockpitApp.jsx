import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Settings, 
  Calendar, 
  Mic, 
  X, 
  Linkedin, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  Target, 
  Zap, 
  BarChart3, 
  PhoneForwarded,
  BrainCircuit,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  Loader2,
  Mail,
  MapPin,
  PhoneOff
} from 'lucide-react';

// --- MOCK DATA ---

const HEATMAP_DATA = Array.from({ length: 5 }, (_, dayIndex) => {
  return Array.from({ length: 11 }, (_, hourIndex) => {
    const hour = hourIndex + 9; // 9h to 19h
    let score = Math.random() * 100;
    if ((dayIndex === 1 || dayIndex === 3) && (hour >= 9 && hour <= 11)) score += 50; 
    if (hour === 13) score = 10;
    return Math.min(Math.max(score, 0), 100);
  });
});

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
const HOURS = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);

const LEADERBOARD = [
  { name: 'Thomas Anderson', company: 'NeoCorp', meetings: 12, score: 2450, avatar: 'TA' },
  { name: 'Sarah Connor', company: 'SkyNet', meetings: 10, score: 2100, avatar: 'SC' },
  { name: 'Rick Deckard', company: 'Blade Run', meetings: 8, score: 1850, avatar: 'RD' },
];

const MOCK_PROSPECTS_DB = [
  { id: 1, name: 'Alice Dubois', title: 'Head of Growth', company: 'ScaleUp.io', industry: 'SaaS', location: 'Paris', enriched: false, avatar: 'AD' },
  { id: 2, name: 'Marc Levy', title: 'Dir. Commercial', company: 'ImmoBest', industry: 'Immo', location: 'Lyon', enriched: false, avatar: 'ML' },
  { id: 3, name: 'Julie Chang', title: 'VP Sales', company: 'FinTech Plus', industry: 'Finance', location: 'Bordeaux', enriched: true, email: 'julie@fintech.com', phone: '+33 6 12 34 56 78', avatar: 'JC' },
  { id: 4, name: 'David Cohen', title: 'CEO', company: 'GreenNrg', industry: 'Énergie', location: 'Marseille', enriched: false, avatar: 'DC' },
  { id: 5, name: 'Emma Watson', title: 'Talent Acq.', company: 'BigCorp', industry: 'RH', location: 'Paris', enriched: false, avatar: 'EW' },
  { id: 6, name: 'Lucas Martin', title: 'CTO', company: 'DevHouse', industry: 'Tech', location: 'Lille', enriched: false, avatar: 'LM' },
];

const PROSPECT_DATA = {
  name: "Sophie Martin",
  title: "VP Sales",
  company: "TechFlow",
  img: "SM",
  linkedin: {
    lastPost: "Fier d'annoncer notre levée de fonds Série A ! 🚀 Nous recrutons 10 commerciaux. #Growth #Hiring",
    activity: "A liké un post sur l'automatisation CRM il y a 2h.",
    tags: ["Recrutement", "Scaling", "Salesforce"]
  },
  crm: {
    lastCall: "Il y a 3 mois (NRP)",
    stack: ["Salesforce", "Aircall", "Slack"],
    notes: "Décideur clé. Intéressée par l'optimisation des SDRs."
  }
};

const CALL_SCRIPT = [
  { sender: 'sys', text: "Connexion établie avec Sophie Martin...", delay: 500 },
  { sender: 'prospect', text: "Allô, Sophie Martin à l'appareil ?", delay: 2000 },
  { sender: 'me', text: "Bonjour Sophie, Thomas de +33. J'ai vu votre post sur la Série A, félicitations !", delay: 2000 },
  { sender: 'prospect', text: "Ah merci ! C'est gentil. On court partout en ce moment.", delay: 3000 },
  { sender: 'me', text: "J'imagine ! Avec 10 recrutements, comment gérez-vous l'onboarding ?", delay: 4000 },
  { sender: 'prospect', text: "C'est le chaos. Mais honnêtement, on a gelé les budgets outils. C'est trop cher.", delay: 3500, triggerObjection: 'budget' },
  { sender: 'me', text: "Je comprends. Mais si je vous montre comment économiser 4h/semaine par rep, ça se rentabilise en 1 mois ?", delay: 4000 },
  { sender: 'prospect', text: "Mmh... 4h par semaine ? C'est ambitieux. Vous avez une démo ?", delay: 3500 },
  { sender: 'me', text: "Absolument. On peut regarder ça mardi 14h ?", delay: 2000 },
  { sender: 'prospect', text: "Ok pour mardi.", delay: 2000, triggerSuccess: true },
];

// --- SUB-COMPONENTS ---

const HeatmapCell = ({ score }) => {
  let colorClass = 'bg-slate-800';
  if (score > 80) colorClass = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  else if (score > 60) colorClass = 'bg-emerald-600/60';
  else if (score > 40) colorClass = 'bg-emerald-800/40';
  else if (score > 20) colorClass = 'bg-slate-700';

  return (
    <div className={`w-full h-8 rounded-sm cursor-pointer transition-all hover:scale-110 hover:border hover:border-white/20 ${colorClass}`} title={`Score: ${Math.round(score)}`}></div>
  );
};

const BattleCard = ({ type, onDismiss, onUse }) => {
  if (!type) return null;
  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 bg-slate-900/90 border-l-4 border-amber-500 rounded-r-lg p-4 mb-4 shadow-2xl backdrop-blur-md max-w-md mx-auto ring-1 ring-white/10">
      <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold tracking-wider text-xs uppercase">
        <BrainCircuit size={16} />
        IA Insight • Objection Détectée
      </div>
      <h3 className="text-white font-bold mb-1 text-lg">"C'est trop cher / Budget gelé"</h3
