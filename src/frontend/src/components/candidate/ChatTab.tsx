import { useState, useEffect, useRef } from 'react';
import { useGetAllMyMessages, useSendMessage } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';
import type { ChatMessage } from '../../backend';

export default function ChatTab() {
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useGetAllMyMessages();
  const sendMessage = useSendMessage();

  const [selectedUser, setSelectedUser] = useState<Principal | null>(null);
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const myPrincipal = identity?.getPrincipal();

  // Get unique conversation partners
  const conversationPartners = messages?.reduce((acc, msg) => {
    const otherUser = msg.sender.toString() === myPrincipal?.toString() ? msg.receiver : msg.sender;
    if (!acc.some((p) => p.toString() === otherUser.toString())) {
      acc.push(otherUser);
    }
    return acc;
  }, [] as Principal[]);

  // Get messages for selected conversation
  const conversationMessages = messages?.filter(
    (msg) =>
      (msg.sender.toString() === myPrincipal?.toString() && msg.receiver.toString() === selectedUser?.toString()) ||
      (msg.receiver.toString() === myPrincipal?.toString() && msg.sender.toString() === selectedUser?.toString())
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      await sendMessage.mutateAsync({
        receiver: selectedUser,
        content: messageText.trim(),
      });
      setMessageText('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!conversationPartners || conversationPartners.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No conversations yet</p>
          <p className="text-sm text-muted-foreground text-center">
            Start chatting with employers after applying to jobs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversationPartners.map((partner) => (
              <button
                key={partner.toString()}
                onClick={() => setSelectedUser(partner)}
                className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-b ${
                  selectedUser?.toString() === partner.toString() ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {partner.toString().slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{partner.toString().slice(0, 20)}...</p>
                    <p className="text-xs text-muted-foreground">Click to view messages</p>
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2">
        {selectedUser ? (
          <>
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {selectedUser.toString().slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedUser.toString().slice(0, 30)}...</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[500px]">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {conversationMessages?.map((msg, idx) => {
                    const isMe = msg.sender.toString() === myPrincipal?.toString();
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(Number(msg.timestamp) / 1000000).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!messageText.trim() || sendMessage.isPending} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a conversation to start chatting</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
