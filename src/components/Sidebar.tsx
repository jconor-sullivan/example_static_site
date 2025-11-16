import React from 'react';
import { SavedNest } from '../App';

interface SidebarProps {
  savedNests: SavedNest[];
  onSelectItem: (type: 'Sites' | 'Docs' | 'Nests', value: string) => void;
  onDeleteNest: (nestId: string) => void;
  categories: any[];
  onCategoriesChange: (categories: any[]) => void;
  sectionOrder: string[];
  onSectionOrderChange: (order: string[]) => void;
}

// Sample data for different sections
const SAMPLE_SITES = [
  { id: '1', name: 'GitHub Repository' },
  { id: '2', name: 'Research Hub' },
  { id: '3', name: 'Documentation Portal' }
];

const SAMPLE_DOCS = [
  { id: '1', name: 'API Documentation' },
  { id: '2', name: 'User Guide' },
  { id: '3', name: 'Technical Spec' }
];

export function Sidebar(props: SidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    Sites: true,
    Docs: true,
    Nests: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (title: string, items: any[], type: 'Sites' | 'Docs' | 'Nests') => {
    const isExpanded = expandedSections[title];

    return (
      <div key={title} style={{ marginBottom: '16px' }}>
        <button
          onClick={() => toggleSection(title)}
          style={{
            width: '100%',
            padding: '12px 8px',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--md-on-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'inherit'
          }}
        >
          {title}
          <span style={{ fontSize: '12px' }}>{isExpanded ? '▼' : '▶'}</span>
        </button>
        
        {isExpanded && (
          <ul style={{ listStyle: 'none', paddingLeft: '8px' }}>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => props.onSelectItem(type as any, item.name)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--md-on-surface)',
                    transition: 'background-color 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e8f5e9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: '256px',
        borderRight: '1px solid #e0e0e0',
        padding: '16px',
        overflowY: 'auto',
        height: '100vh',
        backgroundColor: 'var(--md-surface)',
        color: 'var(--md-on-surface)',
        boxSizing: 'border-box'
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Navigation</h2>
      
      {renderSection('Sites', SAMPLE_SITES, 'Sites')}
      {renderSection('Docs', SAMPLE_DOCS, 'Docs')}
      {renderSection('Nests', props.savedNests, 'Nests')}
      
      {props.savedNests.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Saved Searches</h3>
          <ul style={{ listStyle: 'none' }}>
            {props.savedNests.map((nest) => (
              <li
                key={nest.id}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                <button
                  onClick={() => props.onSelectItem('Nests', nest.name)}
                  style={{
                    textAlign: 'left',
                    flex: 1,
                    fontSize: '13px',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    fontFamily: 'inherit'
                  }}
                >
                  {nest.name}
                </button>
                <button
                  onClick={() => props.onDeleteNest(nest.id)}
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#d32f2f',
                    padding: '0 4px',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#b71c1c')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#d32f2f')}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
