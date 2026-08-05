import React, { useState, useEffect } from 'react';
import { FileText, Search, BookMarked, Sparkles, AlertCircle, RefreshCw, WifiOff, Tag } from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  summary: string;
  fullAdvisory: string;
  date: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Advisory:           'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Clinical Guidelines': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Campaign:           'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewsIntelligencePage() {
  const [advisories, setAdvisories] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [filter, setFilter] = useState('ALL');

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/analytics/news');
      const json = await res.json();
      if (json.success) {
        setAdvisories(json.data.advisories);
        setSelectedNews(json.data.advisories[0] ?? null);
      } else {
        setError('Failed to load health advisories.');
      }
    } catch {
      setError('Network error — showing cached advisories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const filteredNews = advisories.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || news.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categoryLabel = (cat: string) => CATEGORY_COLORS[cat] ?? 'bg-slate-700 text-slate-400 border-slate-600';

  return (
    <CitizenLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h1 className="text-xl font-bold text-slate-100 font-sans">Health News & Advisory Intelligence</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Grounded repository aggregating latest circulars and advisories from Ministry of Health (MoHFW), WHO, ICMR, and National Health Mission.
              </p>
            </div>
            <button
              id="refresh-news-btn"
              onClick={fetchNews}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Stats bar */}
          {!loading && (
            <div className="flex flex-wrap gap-4 mt-4 text-[10px]">
              <span className="text-slate-500">{advisories.length} advisories loaded</span>
              <span className="text-blue-400">{bookmarks.length} bookmarked</span>
              <span className="text-amber-400">{advisories.filter(a => a.category === 'Advisory').length} active health advisories</span>
            </div>
          )}
        </header>

        {error && (
          <div className="flex items-center gap-2 text-amber-400 text-xs p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <WifiOff className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Advisories List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col h-[500px]">
            <div className="flex justify-between items-center gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="news-search"
                  type="text"
                  placeholder="Search advisories, source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                id="news-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-950 text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Advisory">Advisories</option>
                <option value="Clinical Guidelines">Guidelines</option>
                <option value="Campaign">Campaigns</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                <div className="flex items-center justify-center h-32 text-slate-500 text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading advisories…
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-500 text-xs">
                  No advisories match your search.
                </div>
              ) : (
                filteredNews.map((news) => (
                  <div
                    key={news.id}
                    id={`news-item-${news.id}`}
                    onClick={() => setSelectedNews(news)}
                    className={`p-3 border rounded-xl cursor-pointer transition text-xs flex justify-between items-start ${
                      selectedNews?.id === news.id
                        ? 'bg-blue-600/10 border-blue-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-500">{news.date}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${categoryLabel(news.category)}`}>
                          {news.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-200 leading-snug">{news.title}</h4>
                      <span className="text-[10px] text-slate-500">{news.source}</span>
                    </div>
                    <button
                      id={`bookmark-${news.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(news.id);
                      }}
                      className={`p-1.5 rounded-lg border transition flex-shrink-0 mt-0.5 ${
                        bookmarks.includes(news.id)
                          ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                      title={bookmarks.includes(news.id) ? 'Remove bookmark' : 'Bookmark advisory'}
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Summary View */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
            <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" /> AI Executive Summary
            </h3>

            {loading ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading…
              </div>
            ) : selectedNews ? (
              <div className="space-y-4 flex-1 text-xs overflow-y-auto pr-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${categoryLabel(selectedNews.category)}`}>
                      {selectedNews.category}
                    </span>
                    {bookmarks.includes(selectedNews.id) && (
                      <span className="text-[9px] text-blue-400 flex items-center gap-0.5">
                        <BookMarked className="w-3 h-3" /> Bookmarked
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block">{selectedNews.source} — {selectedNews.date}</span>
                  <h4 className="font-bold text-slate-200 text-sm mt-1 leading-snug">{selectedNews.title}</h4>
                </div>

                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-1">
                  <span className="text-blue-400 font-bold block text-[11px]">Grounded AI Summary</span>
                  <p className="text-slate-300 leading-relaxed">{selectedNews.summary}</p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Full Circular / Advisory Notes
                  </h5>
                  <p className="text-slate-400 leading-relaxed">{selectedNews.fullAdvisory}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center">
                <FileText className="w-8 h-8 mb-2 text-slate-700" />
                Select an advisory from the left panel to read its AI executive summary.
              </div>
            )}

            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3 mt-4 flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span>Sourced completely from verified governmental and health agencies. For educational awareness only.</span>
            </div>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
