import React, { useState, useEffect } from 'react';
import { 
  Link, Copy, Check, Clock, BarChart3, ExternalLink, Zap, 
  Globe, Shield, Sparkles, TrendingUp, Eye, Calendar,
  Star, Crown, Hash, Settings, Search, Filter, ArrowRight,
  MousePointer, Users, Activity, Award
} from 'lucide-react';

interface ShortenResponse {
  original_url: string;
  short_url: string;
  short_code: string;
  status: string;
  is_custom: boolean;
}

interface UrlData {
  original_url: string;
  short_url: string;
  short_code: string;
  visits: number;
  created_at: string;
  last_accessed: string | null;
  is_custom: boolean;
}

type ViewMode = 'landing' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [recentUrls, setRecentUrls] = useState<UrlData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'visits' | 'alphabetical'>('recent');

  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchRecentUrls();
    }
  }, [currentView]);

  const fetchRecentUrls = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/recent`);
      if (response.ok) {
        const data = await response.json();
        setRecentUrls(data);
      }
    } catch (err) {
      console.error('Failed to fetch recent URLs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          custom_code: customCode.trim() || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setResult(data);
      setUrl('');
      setCustomCode('');
      if (currentView === 'dashboard') {
        fetchRecentUrls();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  const filteredUrls = recentUrls
    .filter(url => 
      url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.short_code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'visits':
          return b.visits - a.visits;
        case 'alphabetical':
          return a.original_url.localeCompare(b.original_url);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const totalClicks = recentUrls.reduce((sum, url) => sum + url.visits, 0);
  const mostVisited = recentUrls.reduce((max, url) => url.visits > max.visits ? url : max, recentUrls[0] || { visits: 0 });

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-indigo-950 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-300/10 rounded-full blur-2xl animate-float delay-1000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300/40 rounded-full animate-float shadow-lg shadow-blue-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Glass Reflections */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent transform rotate-12 animate-shimmer"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent transform -rotate-12 animate-shimmer delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">LinkForge</span>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-xl text-white hover:bg-blue-500/20 hover:border-blue-300/50 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/10"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full text-blue-300 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered URL Shortening
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in-up">
              Shorten URLs
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Like Magic
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-200">
              Transform long URLs into powerful, trackable short links. Get detailed analytics, 
              custom domains, and enterprise-grade reliability.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up delay-300">
              {[
                { icon: Shield, text: "Secure & Reliable" },
                { icon: TrendingUp, text: "Advanced Analytics" },
                { icon: Globe, text: "Custom Domains" },
                { icon: Zap, text: "Lightning Fast" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-400/20 rounded-full text-blue-200 shadow-lg shadow-blue-500/10">
                  <feature.icon className="w-4 h-4" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-blue-500/5 backdrop-blur-xl border border-blue-400/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 animate-fade-in-up delay-400 relative overflow-hidden">
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/5 to-transparent transform -skew-x-12 animate-shine"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Enter your URL
                    </label>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/very-long-url"
                        className="w-full pl-12 pr-4 py-4 bg-blue-500/5 backdrop-blur-md border border-blue-400/20 rounded-2xl focus:border-blue-300 focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 text-white placeholder-gray-400 text-lg shadow-inner"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Custom alias (optional)
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        placeholder="my-custom-link"
                        className="w-full pl-12 pr-4 py-4 bg-cyan-500/5 backdrop-blur-md border border-cyan-400/20 rounded-2xl focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 text-white placeholder-gray-400 text-lg shadow-inner"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-md shadow-lg shadow-red-500/10">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 disabled:shadow-none relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating magic...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Shorten URL
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </form>

              {/* Result */}
              {result && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-green-400/30 shadow-lg shadow-green-500/10 animate-fade-in relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/5 to-transparent transform -skew-x-12 animate-shine delay-1000"></div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Your link is ready! {result.is_custom && <Crown className="w-4 h-4 text-yellow-400" />}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Shortened URL</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={result.short_url}
                          readOnly
                          className="flex-1 bg-blue-500/10 border border-blue-400/20 rounded-xl px-4 py-3 font-mono text-blue-300 backdrop-blur-md shadow-inner"
                        />
                        <button
                          onClick={() => copyToClipboard(result.short_url)}
                          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center shadow-lg shadow-blue-500/25"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up delay-500">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track clicks, geographic data, and user behavior with detailed insights."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with SSL encryption and fraud protection."
              },
              {
                icon: Globe,
                title: "Custom Domains",
                description: "Use your own domain for branded short links that build trust."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-500/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 hover:bg-blue-500/10 hover:border-blue-300/30 transition-all duration-300 group shadow-lg shadow-blue-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20 border border-blue-400/20">
                  <feature.icon className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="text-center animate-fade-in-up delay-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "10M+", label: "Links Created" },
                { number: "500M+", label: "Clicks Tracked" },
                { number: "99.9%", label: "Uptime" },
                { number: "150+", label: "Countries" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
          }
          .animate-shine {
            animation: shine 3s ease-in-out infinite;
          }
          .animate-shimmer {
            animation: shimmer 4s ease-in-out infinite;
          }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-600 { animation-delay: 0.6s; }
          .delay-1000 { animation-delay: 1s; }
          .delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('landing')}
              className="p-2 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-xl text-white hover:bg-blue-500/20 hover:border-blue-300/50 transition-all duration-300 shadow-lg shadow-blue-500/10"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">URL Dashboard</h1>
              <p className="text-gray-300">Manage and analyze your shortened URLs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 shadow-lg shadow-blue-500/10"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-xl text-white focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 shadow-lg shadow-blue-500/10"
            >
              <option value="recent">Most Recent</option>
              <option value="visits">Most Visited</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 shadow-lg shadow-blue-500/10 relative overflow-hidden group hover:bg-blue-500/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total URLs</p>
                <p className="text-2xl font-bold text-white">{recentUrls.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/20">
                <Link className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/5 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 shadow-lg shadow-cyan-500/10 relative overflow-hidden group hover:bg-cyan-500/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{totalClicks}</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl shadow-lg shadow-cyan-500/20 border border-cyan-400/20">
                <MousePointer className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-6 shadow-lg shadow-indigo-500/10 relative overflow-hidden group hover:bg-indigo-500/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Top Performer</p>
                <p className="text-2xl font-bold text-white">{mostVisited?.visits || 0}</p>
                <p className="text-xs text-gray-400">clicks</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/20">
                <Award className="w-6 h-6 text-indigo-300" />
              </div>
            </div>
          </div>

          <div className="bg-sky-500/5 backdrop-blur-xl border border-sky-400/20 rounded-2xl p-6 shadow-lg shadow-sky-500/10 relative overflow-hidden group hover:bg-sky-500/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Custom URLs</p>
                <p className="text-2xl font-bold text-white">
                  {recentUrls.filter(url => url.is_custom).length}
                </p>
              </div>
              <div className="p-3 bg-sky-500/20 rounded-xl shadow-lg shadow-sky-500/20 border border-sky-400/20">
                <Crown className="w-6 h-6 text-sky-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Create Form */}
        <div className="bg-blue-500/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 mb-8 shadow-lg shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/5 to-transparent transform -skew-x-12 animate-shine"></div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Create</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to shorten..."
                className="w-full px-4 py-3 bg-blue-500/5 backdrop-blur-md border border-blue-400/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 shadow-inner"
                disabled={loading}
              />
            </div>
            <div className="md:w-48">
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="Custom alias"
                className="w-full px-4 py-3 bg-cyan-500/5 backdrop-blur-md border border-cyan-400/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 shadow-inner"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 justify-center min-w-[140px] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Create
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 backdrop-blur-md shadow-lg shadow-red-500/10">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md rounded-xl border border-green-400/30 shadow-lg shadow-green-500/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/5 to-transparent transform -skew-x-12 animate-shine delay-1000"></div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-green-300 text-sm font-medium mb-1 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    URL created successfully! {result.is_custom && <Crown className="w-3 h-3 text-yellow-400" />}
                  </p>
                  <p className="text-blue-300 font-mono text-sm truncate">{result.short_url}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(result.short_url)}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20 border border-blue-400/20"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* URLs List */}
        <div className="bg-blue-500/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 shadow-lg shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/5 to-transparent transform -skew-x-12 animate-shine delay-3000"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Your URLs ({filteredUrls.length})
            </h2>
            <button
              onClick={fetchRecentUrls}
              className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/10 border border-blue-400/20"
            >
              <Clock className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {filteredUrls.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-blue-500/10 rounded-full w-fit mx-auto mb-4 shadow-lg shadow-blue-500/20 border border-blue-400/20">
                <Link className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg mb-2">No URLs found</p>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first shortened URL above'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUrls.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-500/5 backdrop-blur-md rounded-xl p-6 border border-blue-400/20 hover:bg-blue-500/10 hover:border-blue-300/30 transition-all duration-300 group shadow-lg shadow-blue-500/10 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-white truncate text-lg">
                          {truncateUrl(item.original_url, 60)}
                        </h3>
                        <a
                          href={item.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-300 transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {item.is_custom && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-sky-500/20 rounded-full border border-sky-400/30 shadow-lg shadow-sky-500/20">
                            <Crown className="w-3 h-3 text-sky-300" />
                            <span className="text-xs text-sky-300 font-medium">Custom</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-300 mb-3">
                        <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-400/20 shadow-inner">
                          <Hash className="w-4 h-4" />
                          <span className="font-mono">{item.short_code}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-cyan-300">{item.visits}</span>
                          <span>clicks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                        {item.last_accessed && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>Last: {formatDate(item.last_accessed)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-blue-300 font-mono text-sm bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-400/20 shadow-inner">
                          {item.short_url}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyToClipboard(item.short_url)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 flex items-center gap-2 group-hover:scale-105 shadow-lg shadow-blue-500/20 border border-blue-400/20"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Progress bar for clicks */}
                  {totalClicks > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Click Performance</span>
                        <span>{((item.visits / totalClicks) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-blue-500/10 rounded-full h-2 shadow-inner border border-blue-400/20">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/30"
                          style={{ width: `${Math.max((item.visits / totalClicks) * 100, 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;