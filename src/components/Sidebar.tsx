import React from 'react';
import { SavedNest, Category } from '../App';
import { CategoryEditModal } from './CategoryEditModal';

interface SidebarProps {
  savedNests: SavedNest[];
  onSelectItem: (categoryName: string, itemName: string) => void;
  onDeleteNest: (nestId: string) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  sectionOrder: string[];
  onSectionOrderChange: (order: string[]) => void;
}

export function Sidebar(props: SidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    sites: false,
    docs: false,
    nests: false
  });
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [draggedCategoryId, setDraggedCategoryId] = React.useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);
  const [draggedFromCategoryId, setDraggedFromCategoryId] = React.useState<string | null>(null);

  const toggleSection = (categoryId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleSaveCategoryItems = (items: any[]) => {
    if (!editingCategory) return;
    
    const updatedCategories = props.categories.map(cat =>
      cat.id === editingCategory.id ? { ...cat, items } : cat
    );
    props.onCategoriesChange(updatedCategories);
    setShowEditModal(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = props.categories.filter(cat => cat.id !== categoryId);
    props.onCategoriesChange(updatedCategories);
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: `New Category ${props.categories.length + 1}`,
      icon: '📁',
      items: []
    };
    props.onCategoriesChange([...props.categories, newCategory]);
  };

  const handleCategoryDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedCategoryId(categoryId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCategoryDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) return;

    const draggedIndex = props.categories.findIndex(c => c.id === draggedCategoryId);
    const targetIndex = props.categories.findIndex(c => c.id === targetCategoryId);

    const newCategories = [...props.categories];
    const [draggedCategory] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedCategory);

    props.onCategoriesChange(newCategories);
    setDraggedCategoryId(null);
  };

  const handleItemDragStart = (e: React.DragEvent, categoryId: string, itemId: string) => {
    setDraggedItemId(itemId);
    setDraggedFromCategoryId(categoryId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleItemDrop = (e: React.DragEvent, targetCategoryId: string, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItemId || !draggedFromCategoryId) return;

    const updatedCategories = props.categories.map(cat => {
      if (cat.id === draggedFromCategoryId && cat.id === targetCategoryId) {
        // Reorder within same category
        const draggedIndex = cat.items.findIndex(i => i.id === draggedItemId);
        const targetIndex = cat.items.findIndex(i => i.id === targetItemId);

        const newItems = [...cat.items];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);

        return { ...cat, items: newItems };
      }
      return cat;
    });

    props.onCategoriesChange(updatedCategories);
    setDraggedItemId(null);
    setDraggedFromCategoryId(null);
  };

  const renderSection = (category: Category) => {
    const isExpanded = expandedSections[category.id] ?? true;

    return (
      <div
        key={category.id}
        style={{ marginBottom: '16px' }}
        draggable
        onDragStart={(e) => handleCategoryDragStart(e, category.id)}
        onDragOver={handleCategoryDragOver}
        onDrop={(e) => handleCategoryDrop(e, category.id)}
        onDragEnd={() => setDraggedCategoryId(null)}
      >
        <div
          style={{
            width: '100%',
            padding: '12px 8px',
            backgroundColor: draggedCategoryId === category.id ? '#f0f0f0' : 'transparent',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--md-on-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'inherit',
            borderRadius: '4px',
            cursor: 'grab',
            opacity: draggedCategoryId === category.id ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          <button
            onClick={() => toggleSection(category.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--md-on-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
              padding: 0
            }}
          >
            <span>{category.icon && <span style={{ marginRight: '4px' }}>{category.icon}</span>} {category.name}</span>
            <span style={{ fontSize: '12px' }}>{isExpanded ? '▼' : '▶'}</span>
          </button>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              onClick={() => handleEditCategory(category)}
              title="Edit items"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '4px',
                color: 'var(--md-on-surface)',
                fontFamily: 'inherit'
              }}
            >
              ✏️
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              title="Delete category"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '4px',
                color: '#d32f2f',
                fontFamily: 'inherit'
              }}
            >
              🗑
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <ul style={{ listStyle: 'none', paddingLeft: '8px' }}>
            {category.items.map((item) => (
              <li
                key={item.id}
                style={{ marginBottom: '4px' }}
                draggable
                onDragStart={(e) => handleItemDragStart(e, category.id, item.id)}
                onDragOver={handleItemDragOver}
                onDrop={(e) => handleItemDrop(e, category.id, item.id)}
                onDragEnd={() => {
                  setDraggedItemId(null);
                  setDraggedFromCategoryId(null);
                }}
              >
                <button
                  onClick={() => props.onSelectItem(category.name, item.name)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: draggedItemId === item.id ? 'var(--md-background)' : 'var(--md-surface)',
                    border: draggedItemId === item.id ? '2px solid #2196f3' : `1px solid var(--md-on-surface-variant)`,
                    borderRadius: '4px',
                    textAlign: 'left',
                    cursor: 'grab',
                    fontSize: '13px',
                    color: 'var(--md-on-surface)',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    opacity: draggedItemId === item.id ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (draggedItemId !== item.id) {
                      e.currentTarget.style.backgroundColor = 'var(--md-background)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (draggedItemId !== item.id) {
                      e.currentTarget.style.backgroundColor = 'var(--md-surface)';
                    }
                  }}
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
    <>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Navigation</h2>
          <button
            onClick={handleAddCategory}
            title="Add category"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
              color: 'var(--md-on-surface)',
              fontFamily: 'inherit'
            }}
          >
            +
          </button>
        </div>
        
        {props.categories.map(category => renderSection(category))}
        
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

      <CategoryEditModal
        open={showEditModal}
        category={editingCategory}
        onOpenChange={setShowEditModal}
        onSave={handleSaveCategoryItems}
      />
    </>
  );
}
