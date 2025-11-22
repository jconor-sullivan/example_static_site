import React, { useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { SearchFilters, ParametricPill, Category } from '../App';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSubmit: () => void;
  onSave: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  categories?: Category[];
}

type SuggestionStep = 'category' | 'subcategory';

interface Suggestion {
  type: 'category' | 'subcategory';
  id: string;
  value: string;
  icon?: string;
  parentId?: string;
}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionStep, setSuggestionStep] = useState<SuggestionStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
      
      if (suggestionStep === 'category' && props.categories) {
        // Show categories
        const categoryMatches: Suggestion[] = props.categories
          .filter(cat => cat.name.toLowerCase().includes(searchTerm))
          .map(cat => ({
            type: 'category',
            id: cat.id,
            value: cat.name,
            icon: cat.icon
          }));
        
        setSuggestions(categoryMatches);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    // Move to subcategory selection
    setSelectedCategory(category);
    setSuggestionStep('subcategory');
    
    // Create subcategory suggestions
    const subcategorySuggestions: Suggestion[] = category.items.map(item => ({
      type: 'subcategory',
      id: item.id,
      value: item.name,
      parentId: category.id
    }));
    
    setSuggestions(subcategorySuggestions);
  };

  const handleSubcategorySelect = (subcategory: Suggestion) => {
    if (!selectedCategory) return;
    
    // Remove the hashtag command and add as pill
    const words = props.filters.query.split(/\s+/);
    words.pop(); // Remove the hashtag command
    const newQuery = words.join(' ').trim();
    
    const newPill: ParametricPill = {
      id: Date.now().toString(),
      type: selectedCategory.name,
      value: subcategory.value
    };
    
    props.onFiltersChange({
      ...props.filters,
      query: newQuery,
      pills: [...props.filters.pills, newPill]
    });
    
    // Reset state
    setShowSuggestions(false);
    setSuggestionStep('category');
    setSelectedCategory(null);
    setSuggestions([]);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'category') {
      const category = props.categories?.find(c => c.id === suggestion.id);
      if (category) {
        handleCategorySelect(category);
      }
    } else if (suggestion.type === 'subcategory') {
      handleSubcategorySelect(suggestion);
    }
  };

  return (
    <div className={styles.container}>
      {/* Pills Display */}
      {props.filters.pills.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '8px'
        }}>
          {props.filters.pills.map((pill) => (
            <div
              key={pill.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#2196f3',
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <span>{pill.type}</span>
              <span style={{ opacity: 0.9 }}>|</span>
              <span>{pill.value}</span>
              <button
                onClick={() => {
                  const newPills = props.filters.pills.filter(p => p.id !== pill.id);
                  props.onFiltersChange({
                    ...props.filters,
                    pills: newPills
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0 2px',
                  marginLeft: '4px',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.inputGroup} style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Hit # to activate precision prompting"
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
            {suggestionStep === 'category' && selectedCategory === null && (
              <div style={{ padding: '8px 0' }}>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
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
                    {suggestion.icon && <span style={{ fontSize: '18px' }}>{suggestion.icon}</span>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{suggestion.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {suggestionStep === 'subcategory' && selectedCategory && (
              <div style={{ padding: '8px 0' }}>
                <div style={{ padding: '8px 16px', fontSize: '12px', color: '#999', fontWeight: '600' }}>
                  SELECT FROM {selectedCategory.name.toUpperCase()}
                </div>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
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
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{suggestion.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={props.onSubmit}
          className={styles.buttonPrimary}
          style={{ padding: '8px 12px' }}
        >
          🔍
        </button>
        <button
          onClick={props.onSave}
          className={styles.buttonSecondary}
          style={{ backgroundColor: 'var(--md-surface)', color: 'var(--md-on-surface)' }}
        >
          Nest
        </button>
      </div>
    </div>
  );
};
