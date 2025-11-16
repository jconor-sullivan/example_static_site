import React from 'react';
import { ParametricPill } from '../App';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pills?: ParametricPill[];
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatWindow(props: ChatWindowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [props.messages, props.isTyping]);

  return (
    <div 
      ref={scrollRef}
      className="flex flex-col gap-4 overflow-y-auto pr-4"
      style={{ backgroundColor: 'var(--md-background)' }}
    >
      {props.messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            {msg.pills && msg.pills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {msg.pills.map((pill) => (
                  <span key={pill.id} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {pill.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {props.isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-black p-4 rounded-lg">
            <p className="text-sm">Typing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
