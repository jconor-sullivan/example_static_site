import React, { useState } from 'react';
import { Category, CategoryItem } from '../App';

interface CategoryEditModalProps {
  open: boolean;
  category: Category | null;
  onOpenChange: (open: boolean) => void;
  onSave: (items: CategoryItem[]) => void;
}

export function CategoryEditModal(props: CategoryEditModalProps) {
  const [newItemName, setNewItemName] = useState('');
  const [items, setItems] = useState<CategoryItem[]>(props.category?.items || []);

  React.useEffect(() => {
    if (props.category) {
      setItems(props.category.items);
      setNewItemName('');
    }
  }, [props.category, props.open]);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: CategoryItem = {
        id: Date.now().toString(),
        name: newItemName.trim()
      };
      setItems([...items, newItem]);
      setNewItemName('');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSave = () => {
    props.onSave(items);
    props.onOpenChange(false);
  };

  if (!props.open || !props.category) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001
      }}
      onClick={() => props.onOpenChange(false)}
    >
      <div
        style={{
          backgroundColor: 'var(--md-surface)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--md-on-surface)' }}>
          Edit {props.category.name}
        </h2>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder={`New ${props.category.name} item...`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddItem();
              }
            }}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d0d0d0',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: 'var(--md-background)',
              color: 'var(--md-on-background)'
            }}
          />
          <button
            onClick={handleAddItem}
            style={{
              padding: '10px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: '500'
            }}
          >
            Add
          </button>
        </div>

        <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
          {items.length === 0 ? (
            <p style={{ color: '#999', fontSize: '14px' }}>No items yet</p>
          ) : (
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    backgroundColor: 'var(--md-background)',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: 'var(--md-on-background)'
                  }}
                >
                  <span>{item.name}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d32f2f',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0 4px',
                      fontFamily: 'inherit'
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => props.onOpenChange(false)}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f5f5f5',
              color: 'var(--md-on-surface)',
              border: '1px solid #d0d0d0',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: '500'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
