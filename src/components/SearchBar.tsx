import React, { useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { SearchFilters, ParametricPill } from '../App';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSubmit: () => void;
  onSave: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    props.onFiltersChange({
      ...props.filters,
      query: value
    });

    // Check for hashtag command
    const lastWord = value.split(/\s+/).pop() || '';
    if (lastWord.startsWith('#')) {
      const searchTerm = lastWord.substring(1).toLowerCase();
      
      // Generate suggestions based on search term
      const allSuggestions = [
        { type: 'Sites', value: 'GitHub', icon: '🔗' },
        { type: 'Sites', value: 'Research Paper', icon: '📄' },
        { type: 'Docs', value: 'API Documentation', icon: '📚' },
        { type: 'Docs', value: 'User Guide', icon: '📖' },
        { type: 'Nests', value: 'Recent Search', icon: '📌' }
      ];
      
      const filtered = allSuggestions.filter(s => 
        s.value.toLowerCase().includes(searchTerm) || s.type.toLowerCase().includes(searchTerm)
      );
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    // Remove the hashtag command and add as pill
    const words = props.filters.query.split(/\s+/);
    words.pop(); // Remove the hashtag command
    const newQuery = words.join(' ').trim();
    
    const newPill: ParametricPill = {
      id: Date.now().toString(),
      type: suggestion.type,
      value: suggestion.value
    };
    
    props.onFiltersChange({
      ...props.filters,
      query: newQuery,
      pills: [...props.filters.pills, newPill]
    });
    
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup} style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type #category to add filters..."
          value={props.filters.query}
          onChange={handleInputChange}
          onKeyPress={props.onKeyPress}
          className={styles.input}
          style={{ backgroundColor: 'var(--md-surface)', color: 'var(--md-on-surface)' }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--md-surface)',
              border: '1px solid #d0d0d0',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontSize: '18px' }}>{suggestion.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{suggestion.value}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{suggestion.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={props.onSubmit}
          className={styles.buttonPrimary}
        >
          Search
        </button>
        <button
          onClick={props.onSave}
          className={styles.buttonSecondary}
          style={{ backgroundColor: 'var(--md-surface)', color: 'var(--md-on-surface)' }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
