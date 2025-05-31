
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Users } from 'lucide-react';

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: 'Sistema',
      message: 'Bem-vindos à transmissão ao vivo do Rio São Francisco!',
      timestamp: new Date(),
      isSystem: true
    },
    {
      id: 2,
      user: 'João Pescador',
      message: 'Que bela vista do rio hoje!',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 3,
      user: 'Maria Silva',
      message: 'Alguém sabe se os peixes estão ativos hoje?',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      user: 'Carlos Prado',
      message: 'Condições perfeitas para pesca! 🎣',
      timestamp: new Date(Date.now() - 120000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [userName] = useState('Visitante');
  const [onlineUsers] = useState(24);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        user: userName,
        message: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 text-rio-blue mr-2" />
            Chat Ao Vivo
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            {onlineUsers} online
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-80 flex flex-col">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`${msg.isSystem ? 'text-center' : ''}`}>
                <div className={`${msg.isSystem ? 'bg-blue-50 p-2 rounded-lg text-blue-800 text-sm' : ''}`}>
                  {!msg.isSystem && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-rio-blue">
                        {msg.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <p className={`text-sm ${msg.isSystem ? '' : 'text-gray-700'}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              size="sm"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBox;
