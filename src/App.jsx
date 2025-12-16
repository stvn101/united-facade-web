import React, { useState, useRef, useEffect, Component } from 'react';
import {
  Menu, X, ChevronRight, ChevronLeft, ArrowRight, Mail, Check,
  Building2, Hammer, Shield, Grid, Truck, Maximize, Layers,
  Facebook, Twitter, Instagram, Linkedin, MessageSquare,
  Sparkles, Send, Loader2
} from 'lucide-react';

/* ==========================================================================
   UNITED FACADE - MASTER CONFIGURATION
   ==========================================================================
   Edit these values to customize your site without touching the complex code.
*/

const CONFIG = {
  companyName: "United Facade",
  contactEmail: "contact@unitedfacade.com.au",
  // If you have a Gemini API key, paste it inside the quotes below.
  // If left empty, the AI features will show a polite "offline" message.
  geminiApiKey: "",
};

// Your local images map. When you move to Antigravity, ensure these files 
// are in your 'public' or 'assets' folder.
const LOCAL_IMAGES = {
  partitions: "/292.png", // Metal stud framing
  sheeting: "/302.png",   // Ceiling setting
  fire: "/298.png",       // Pink fire board
  glass: "/296.png",      // Glass balcony
};

const SERVICES_DATA = [
  {
    title: "Partitions & Ceilings",
    desc: "Precision interior structuring for modern commercial spaces. Metal stud framing and suspended ceiling systems.",
    icon: <Layers size={32} />,
    image: LOCAL_IMAGES.partitions,
    fallback: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Sheeting & Setting",
    desc: "Flawless finishes and high-grade plasterboard installation for commercial fit-outs.",
    icon: <Hammer size={32} />,
    image: LOCAL_IMAGES.sheeting,
    fallback: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Fire Rating & Acoustic",
    desc: "Certified safety systems and advanced soundproofing solutions using high-density materials.",
    icon: <Shield size={32} />,
    image: LOCAL_IMAGES.fire,
    fallback: "https://images.unsplash.com/photo-1523472723673-73af32e04143?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Shopfront & Window Wall",
    desc: "Premium retail frontages designed for maximum visual impact.",
    icon: <Grid size={32} />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    fallback: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Curtain Wall & Mini Crane",
    desc: "Complex facade installation with specialized lifting equipment.",
    icon: <Truck size={32} />,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    fallback: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Glass Balustrading",
    desc: "Frameless and semi-frameless glass solutions for safety and style.",
    icon: <Maximize size={32} />,
    image: LOCAL_IMAGES.glass,
    fallback: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Cladding & Exteriors",
    desc: "Durable, aesthetic composite cladding for commercial envelopes.",
    icon: <Building2 size={32} />,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=800",
    fallback: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=800"
  },
];

/* ==========================================================================
   CORE COMPONENTS
   ========================================================================== */

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("App Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <Shield size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
          <button onClick={() => window.location.reload()} className="mt-6 bg-blue-600 px-6 py-2 rounded-full font-bold">Refresh App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const UnitedFacadeLogo = ({ className = "" }) => (
  <img
    src="/logo.png"
    alt="United Facade"
    className={`h-16 md:h-20 w-auto object-contain ${className}`}
  />
);

const Button = ({ children, primary, icon: Icon, onClick, fullWidth, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
      ${fullWidth ? 'w-full' : ''}
      ${primary
        ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
        : 'bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20'}
      ${className}
    `}
  >
    {children}
    {Icon && <Icon size={16} />}
  </button>
);

const callGemini = async (prompt, systemInstruction) => {
  const apiKey = CONFIG.geminiApiKey;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  if (!apiKey) return "AI services are currently offline. Please contact us via email.";

  try {
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
    });
    if (!response.ok) return "Our experts are currently busy. Please use the contact form.";
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
  } catch (error) { return "Connection error. Please try again later."; }
};

/* ==========================================================================
   FEATURE COMPONENTS (Modals & Widgets)
   ========================================================================== */

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    // In Antigravity, you would replace this with a real API call to your backend
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => { setStatus('idle'); setFormData({ name: '', email: '', phone: '', message: '' }); onClose(); }, 2500);
    }, 1500);
  };

  const handlePolishing = async () => {
    if (!formData.message || formData.message.length < 5) return;
    setStatus('polishing');
    const polished = await callGemini(`Rewrite nicely for construction quote: "${formData.message}"`, "You rewrite messages to be professional.");
    setFormData(prev => ({ ...prev, message: polished }));
    setStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1c1c1e] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden animate-fade-in-up">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
              <Mail size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-white">Get a Quote</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Fill out the form below and our sales team will get back to you shortly at <span className="text-white">{CONFIG.contactEmail}</span>
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <Check className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Request Sent!</h3>
            <p className="text-gray-400 text-center max-w-xs">
              Thank you, {formData.name}. We have received your inquiry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                placeholder="Name *"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                placeholder="Email *"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                placeholder="Phone"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5 ml-1">
                <label className="block text-xs font-medium text-gray-400">Message</label>
                <button
                  type="button"
                  onClick={handlePolishing}
                  disabled={status === 'polishing' || !formData.message}
                  className="text-[10px] text-blue-300 flex items-center gap-1 hover:text-blue-100 disabled:opacity-50 transition-colors"
                >
                  {status === 'polishing' ? <Loader2 className="animate-spin" size={10} /> : <Sparkles size={10} />}
                  {status === 'polishing' ? 'Polishing...' : 'Polish with AI'}
                </button>
              </div>
              <textarea
                rows="4"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 resize-none"
                placeholder="Project details..."
              ></textarea>
            </div>

            <Button fullWidth primary className="!rounded-xl">
              {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1c1c1e] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 scale-125"><UnitedFacadeLogo /></div>
          <h2 className="text-2xl font-semibold text-white mb-2">Sign in to United Facade</h2>
        </div>
        <div className="space-y-4">
          <button className="w-full bg-white text-black font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
            Sign in with Google
          </button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider">Or use email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          <form className="space-y-4">
            <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500" />
            <Button fullWidth primary className="!rounded-xl">Continue</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Hi! I'm the United Facade AI. How can I help?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', text: input }]);
    setInput(''); setLoading(true);
    const res = await callGemini(input, "You are an expert for United Facade (Construction). Keep answers short and professional.");
    setMessages(p => [...p, { role: 'assistant', text: res }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[300px] h-[400px] bg-[#1c1c1e] border border-white/10 rounded-2xl flex flex-col overflow-hidden animate-fade-in-up shadow-2xl">
          <div className="p-3 bg-blue-900/20 border-b border-white/10 flex justify-between items-center">
            <span className="text-white font-medium flex items-center gap-2"><Sparkles size={16} className="text-blue-400" /> AI Expert</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#121212]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 px-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 ml-2">Thinking...</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-[#1c1c1e] border-t border-white/10 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            <button type="submit" disabled={loading} className="text-blue-500 hover:text-blue-400 disabled:opacity-50"><Send size={18} /></button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-white transition-all hover:scale-110">
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
};

const ServiceCard = ({ service }) => (
  <div className="group relative flex-shrink-0 w-[300px] h-[450px] rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 border border-white/5 snap-center">
    <div className="absolute inset-0">
      <img
        src={service.image}
        onError={(e) => { e.target.onerror = null; e.target.src = service.fallback; }}
        alt={service.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
    </div>

    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-lg">
        <div className="mb-2 text-blue-400">{service.icon}</div>
        <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
        <p className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all overflow-hidden leading-relaxed">{service.desc}</p>
        <div className="mt-2 flex items-center text-white text-xs font-bold uppercase tracking-wider group-hover:mt-4 transition-all">
          Learn more <ArrowRight size={12} className="ml-2" />
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN CONTENT ---

const AppContent = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white overflow-x-hidden selection:bg-blue-500/30">

      {/* Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src="/logo.png"
          alt=""
          className="w-[80vw] md:w-[60vw] h-auto object-contain opacity-[0.05] -rotate-12 blur-[1px]"
        />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#121212]/90 backdrop-blur-xl border-b border-white/5 py-2' : 'py-4 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <UnitedFacadeLogo />

          <div className="hidden md:flex gap-8 items-center">
            {['Services', 'Projects', 'About'].map(i => (
              <a key={i} href={`#${i.toLowerCase()}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{i}</a>
            ))}
            <button onClick={() => setContactOpen(true)} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact</button>
            <button onClick={() => setAuthOpen(true)} className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">Sign In</button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#121212] border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in-up shadow-2xl">
            {['Services', 'Projects', 'Contact'].map(i => (
              <a key={i} href="#" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-200">{i}</a>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <button onClick={() => { setMenuOpen(false); setAuthOpen(true); }} className="bg-blue-600 text-white py-3 rounded-xl font-bold w-full">Sign In</button>
          </div>
        )}
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <AIChatWidget />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[11px] text-blue-200 tracking-wider uppercase font-bold shadow-glow">
            <Sparkles size={12} className="text-blue-400" />
            AI Assistant Online
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">United</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-600">Facade.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Redefining skylines with premium facade solutions. From acoustic systems to complex curtain walls, we build the future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button primary icon={ChevronRight} onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
              Explore Services
            </Button>
            <Button icon={Mail} onClick={() => setContactOpen(true)}>
              Get Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section id="services" className="relative py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Expertise.</h2>
            <p className="text-gray-400 max-w-md">Comprehensive facade and interior solutions tailored for tier-one commercial projects.</p>
          </div>

          <div className="hidden md:flex gap-3">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><ChevronRight size={24} /></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-8 overflow-x-auto px-6 pb-12 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SERVICES_DATA.map((s, i) => <ServiceCard key={i} service={s} />)}
          <div className="w-8 flex-shrink-0" /> {/* Spacer */}
        </div>
      </section>

      {/* Featurette */}
      <section className="py-24 px-6 bg-[#111]">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#1c1c1e] border border-white/5 overflow-hidden relative min-h-[500px] flex items-center shadow-2xl">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-30" alt="Architecture" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1e] via-[#1c1c1e]/90 to-transparent" />
          </div>

          <div className="relative z-10 p-12 md:p-24 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">Safety. Quality. Integrity.</h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              At United Facade, we don't just build walls; we engineer environments. Our commitment to ISO-certified safety standards and premium materials ensures your project stands the test of time.
            </p>
            <div className="flex gap-12 mb-10">
              <div>
                <div className="text-4xl font-bold text-blue-500 mb-1">18+</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Years Exp</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-500 mb-1">100%</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Safety Record</div>
              </div>
            </div>
            <Button primary onClick={() => setContactOpen(true)}>Start Project</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-8">
                <UnitedFacadeLogo />
              </div>
              <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
                Leading the industry in commercial exteriors, glazing, and interior fit-outs. Australian owned and operated.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6">Services</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                {SERVICES_DATA.map((service) => (
                  <li key={service.title}><a href="#" className="hover:text-blue-400 transition-colors">{service.title}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                {['About Us', 'Projects', 'Careers', 'Contact'].map(i => (
                  <li key={i}><a href="#" className="hover:text-blue-400 transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">
              Copyright © {new Date().getFullYear()} United Facade Pty Ltd. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400">Terms of Use</a>
              <a href="#" className="hover:text-gray-400">Site Map</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .shadow-glow { box-shadow: 0 0 15px rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

// --- WRAPPER (This catches errors) ---
const App = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;
