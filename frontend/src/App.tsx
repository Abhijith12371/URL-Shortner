import React, { useState, useEffect } from 'react';
import { Link, Copy, Check, Clock, BarChart3, ExternalLink, Zap } from 'lucide-react';

interface ShortenResponse {
  original_url: string;
  short_url: string;
  short_code: string;
}

interface RecentUrl {
  original_url: string;
  short_url: string;
  short_code: string;
  visits: number;
  created_at: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [recentUrls, setRecentUrls] = useState<RecentUrl[]>([]);

  // In a real app, this would be an environment variable
  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    fetchRecentUrls();
  }, []);

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
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setResult(data);
      setUrl('');
      fetchRecentUrls(); // Refresh recent URLs
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              URL Shortener
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform long URLs into short, shareable links instantly. Track clicks and manage your links with ease.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your URL
              </label>
              <div className="relative">
                <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Shortening...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Shorten URL
                </div>
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Your shortened URL is ready!
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Original URL</label>
                  <p className="text-gray-800 break-all bg-white/50 p-3 rounded-xl">
                    {result.original_url}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Shortened URL</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={result.short_url}
                      readOnly
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-blue-600"
                    />
                    <button
                      onClick={() => copyToClipboard(result.short_url)}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 min-w-[120px] justify-center"
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

        {/* Recent URLs */}
        {recentUrls.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              Recent URLs
            </h2>
            
            <div className="space-y-4">
              {recentUrls.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {truncateUrl(item.original_url)}
                        </h3>
                        <a
                          href={item.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">
                          {item.short_code}
                        </span>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {item.visits} clicks
                        </div>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(item.short_url)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with React and TypeScript • Powered by Flask</p>
        </div>
      </div>
    </div>
  );
}

export default App;