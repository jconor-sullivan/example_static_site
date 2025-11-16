import React from 'react';

interface SaveNestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description?: string) => void;
}

export function SaveNestModal(props: SaveNestModalProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSave = () => {
    if (name.trim()) {
      props.onSave(name, description);
      setName('');
      setDescription('');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    props.onOpenChange(false);
  };

  if (!props.open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'var(--md-surface)',
        color: 'var(--md-on-surface)',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '384px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Save Search as Nest</h2>
        <input
          type="text"
          placeholder="Nest name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '14px',
            fontFamily: 'inherit',
            backgroundColor: 'var(--md-background)',
            color: 'var(--md-on-surface)',
            boxSizing: 'border-box'
          }}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px',
            fontFamily: 'inherit',
            backgroundColor: 'var(--md-background)',
            color: 'var(--md-on-surface)',
            height: '96px',
            boxSizing: 'border-box',
            resize: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              backgroundColor: 'var(--md-surface)',
              color: 'var(--md-on-surface)',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'background-color 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'background-color 0.2s'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
