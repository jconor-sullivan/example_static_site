import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { ChatWindow, ChatMessage } from './components/ChatWindow';
import { PillDisplay } from './components/PillDisplay';
import { MOCK_DOCUMENTS } from './components/DocumentLibrary';
import { Button } from './components/ui/button';
import { SaveNestModal } from './components/SaveNestModal';
import { Logo } from './components/Logo';
import { DarkModeToggle } from './components/DarkModeToggle';

export interface ParametricPill {
  id: string;
  type: string; // Can be 'Sites', 'Docs', 'Nests', or any custom category name
  value: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  items: CategoryItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface SavedNest {
  id: string;
  name: string;
  description?: string;
  pills: ParametricPill[];
  query: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  pills: ParametricPill[];
  fileTypes: string[];
  dateRange: { start: string; end: string };
  tags: string[];
  sources: string[];
  sortBy: string;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  source: string;
  dateAdded: string;
  tags: string[];
  size: string;
  preview: string;
  url?: string;
}

export default function App() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedNests, setSavedNests] = useState<SavedNest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>(['Sites', 'Docs', 'Nests']); // Order of sections in sidebar
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    pills: [],
    fileTypes: [],
    dateRange: { start: '', end: '' },
    tags: [],
    sources: [],
    sortBy: 'date-desc'
  });

  // Track if user has submitted first prompt
  const hasSubmittedPrompt = messages.length > 0;

  const handleSaveNest = (name: string, description?: string) => {
    const newNest: SavedNest = {
      id: Date.now().toString(),
      name,
      description,
      pills: filters.pills,
      query: filters.query,
      createdAt: new Date().toISOString()
    };
    setSavedNests([...savedNests, newNest]);
    setShowSaveModal(false);
  };

  const handleDeleteNest = (nestId: string) => {
    setSavedNests(savedNests.filter(nest => nest.id !== nestId));
  };

  const handleSidebarItemSelect = (type: 'Sites' | 'Docs' | 'Nests', value: string) => {
    // Add pill to search
    const newPill: ParametricPill = {
      id: Date.now().toString(),
      type,
      value
    };
    setFilters({
      ...filters,
      pills: [...filters.pills, newPill]
    });
  };

  const handleRemovePill = (pillId: string) => {
    setFilters({
      ...filters,
      pills: filters.pills.filter(p => p.id !== pillId)
    });
  };

  const handleSubmitPrompt = () => {
    if (!filters.query && filters.pills.length === 0) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: filters.query || 'Search with filters',
      pills: filters.pills.length > 0 ? [...filters.pills] : undefined,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(filters),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);

    // Clear only the query after submission, keep pills for persistence
    setFilters({
      ...filters,
      query: ''
    });
  };

  const generateMockResponse = (currentFilters: SearchFilters): string => {
    let response = "I've searched through your sources";
    
    if (currentFilters.pills.length > 0) {
      response += " with the following filters:\n\n";
      currentFilters.pills.forEach(pill => {
        response += `• ${pill.type}: ${pill.value}\n`;
      });
      response += "\n";
    }
    
    if (currentFilters.query) {
      response += `\nBased on your query "${currentFilters.query}", here's what I found:\n\n`;
    }
    
    response += "Here are the most relevant results:\n\n";
    response += "1. The research indicates strong correlations between the parameters you've specified.\n";
    response += "2. Multiple documents in your library support this conclusion.\n";
    response += "3. Consider exploring related topics in your saved nests for deeper insights.\n\n";
    response += "Would you like me to provide more specific information from any of these sources?";
    
    return response;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPrompt();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative', backgroundColor: 'var(--md-background)' }}>
      {/* Dark Mode Toggle - Top Right */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 50 }}>
        <DarkModeToggle />
      </div>

      {/* Sidebar */}
      <Sidebar 
        savedNests={savedNests} 
        onSelectItem={handleSidebarItemSelect}
        onDeleteNest={handleDeleteNest}
        categories={categories}
        onCategoriesChange={setCategories}
        sectionOrder={sectionOrder}
        onSectionOrderChange={setSectionOrder}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!hasSubmittedPrompt ? (
          /* Initial State - Centered Search */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', paddingTop: '64px' }}>
            <div style={{ width: '100%', maxWidth: '768px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px', padding: '0 8px' }}>
                <Logo style={{ height: '64px', width: 'auto', marginLeft: 'auto', marginRight: 'auto', marginBottom: '8px', color: 'var(--md-on-background)' }} />
                <p style={{ fontSize: '16px', lineHeight: '1.5', color: 'var(--md-on-surface-variant)' }}>Precise prompting for deeper context</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SearchBar 
                  filters={filters} 
                  onFiltersChange={setFilters}
                  documents={MOCK_DOCUMENTS.map(doc => ({ id: doc.id, title: doc.title }))}
                  savedNests={savedNests}
                  onKeyPress={handleKeyPress}
                  onSave={() => setShowSaveModal(true)}
                  onSubmit={handleSubmitPrompt}
                  categories={categories}
                  sectionOrder={sectionOrder}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Chat Mode - Chat Window with Search Below */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 24px', overflow: 'hidden', minHeight: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: '16px', textAlign: 'center', marginTop: '48px', padding: '0 8px' }}>
              <Logo style={{ height: '40px', width: 'auto', marginLeft: 'auto', marginRight: 'auto', marginBottom: '4px', color: 'var(--md-on-background)' }} />
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--md-on-surface-variant)' }}>Precise prompting for deeper context</p>
            </div>

            {/* Chat Window */}
            <div style={{ flex: 1, marginBottom: '16px', minHeight: 0 }}>
              <ChatWindow messages={messages} isTyping={isTyping} />
            </div>

            {/* Search Bar at Bottom */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SearchBar 
                filters={filters} 
                onFiltersChange={setFilters}
                documents={MOCK_DOCUMENTS.map(doc => ({ id: doc.id, title: doc.title }))}
                savedNests={savedNests}
                onKeyPress={handleKeyPress}
                hidePillsInInput={true}
                onSave={() => setShowSaveModal(true)}
                onSubmit={handleSubmitPrompt}
                categories={categories}
                sectionOrder={sectionOrder}
              />
              
              {/* Active Pills Display */}
              <PillDisplay
                pills={filters.pills}
                onRemovePill={handleRemovePill}
                documents={MOCK_DOCUMENTS.map(doc => ({ id: doc.id, title: doc.title }))}
                savedNests={savedNests}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Nest Modal */}
      <SaveNestModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveNest}
      />

      {/* Signature */}
      <div style={{ position: 'fixed', bottom: '16px', right: '24px', fontSize: '12px', color: '#999', display: 'none' }}>
        Application designed by{' '}
        <a 
          href="https://sites.google.com/view/jconor/home" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#2196f3', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          J. Conor Sullivan
        </a>
      </div>
    </div>
  );
}
