"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  CheckCheck,
  Clock,
  User,
  Filter,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TierBadge } from "@/components/trackverse";

// Mock conversations
const mockConversations = [
  {
    id: "1",
    athleteId: "1",
    athleteName: "Jaylen Thompson",
    athleteSchool: "Lincoln High School",
    athleteTier: "GODSPEED" as const,
    lastMessage: "Thank you for reaching out! I'm very interested in learning more about your program.",
    lastMessageTime: "2 hours ago",
    unread: true,
    starred: true,
    messages: [
      {
        id: "m1",
        sender: "scout",
        content: "Hi Jaylen! I'm Coach Smith from State University. I've been following your season and I'm very impressed with your 100m times. Would you be interested in learning more about our track program?",
        timestamp: "Dec 30, 2024 2:30 PM",
        read: true,
      },
      {
        id: "m2",
        sender: "athlete",
        content: "Thank you for reaching out! I'm very interested in learning more about your program.",
        timestamp: "Dec 30, 2024 4:45 PM",
        read: true,
      },
    ],
  },
  {
    id: "2",
    athleteId: "2",
    athleteName: "Marcus Johnson",
    athleteSchool: "Roosevelt High School",
    athleteTier: "NATIONAL" as const,
    lastMessage: "I'll be at the Winter Invitational next month if you'd like to meet.",
    lastMessageTime: "1 day ago",
    unread: false,
    starred: false,
    messages: [
      {
        id: "m1",
        sender: "scout",
        content: "Marcus, great race at regionals! Your 400m time was impressive.",
        timestamp: "Dec 28, 2024 10:00 AM",
        read: true,
      },
      {
        id: "m2",
        sender: "athlete",
        content: "Thanks Coach! I've been working hard on my speed endurance.",
        timestamp: "Dec 28, 2024 11:30 AM",
        read: true,
      },
      {
        id: "m3",
        sender: "scout",
        content: "It shows! Would love to chat more about your goals.",
        timestamp: "Dec 28, 2024 2:00 PM",
        read: true,
      },
      {
        id: "m4",
        sender: "athlete",
        content: "I'll be at the Winter Invitational next month if you'd like to meet.",
        timestamp: "Dec 29, 2024 9:15 AM",
        read: true,
      },
    ],
  },
  {
    id: "3",
    athleteId: "3",
    athleteName: "Tyler Smith",
    athleteSchool: "Jefferson High School",
    athleteTier: "NATIONAL" as const,
    lastMessage: "Yes, I'm planning to compete in both hurdles and long jump this season.",
    lastMessageTime: "3 days ago",
    unread: false,
    starred: true,
    messages: [
      {
        id: "m1",
        sender: "scout",
        content: "Tyler, I noticed you compete in multiple events. Are you planning to continue that in college?",
        timestamp: "Dec 27, 2024 3:00 PM",
        read: true,
      },
      {
        id: "m2",
        sender: "athlete",
        content: "Yes, I'm planning to compete in both hurdles and long jump this season.",
        timestamp: "Dec 27, 2024 5:30 PM",
        read: true,
      },
    ],
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(mockConversations[0].id);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const filteredConversations = mockConversations.filter(conv => {
    if (searchQuery && !conv.athleteName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter === "unread" && !conv.unread) return false;
    if (filter === "starred" && !conv.starred) return false;
    return true;
  });

  const activeConversation = mockConversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In real app, would send message to API
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            href="/recruiting" 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Recruiting
          </Link>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-orange-100 text-sm">
            {mockConversations.filter(c => c.unread).length} unread conversations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="bg-zinc-900 border-zinc-800 flex flex-col overflow-hidden">
            {/* Search & Filter */}
            <div className="p-4 border-b border-zinc-800">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-zinc-800 border-zinc-700 text-sm"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "unread", "starred"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filter === f 
                        ? "bg-orange-500 text-white" 
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 text-left border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${
                    selectedConversation === conv.id ? "bg-zinc-800" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {conv.athleteName.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`font-medium truncate ${conv.unread ? "text-white" : "text-zinc-300"}`}>
                            {conv.athleteName}
                          </span>
                          {conv.starred && (
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-zinc-500 flex-shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-1">{conv.athleteSchool}</p>
                      <p className={`text-sm truncate ${conv.unread ? "text-zinc-200" : "text-zinc-500"}`}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unread && (
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2 flex flex-col overflow-hidden">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-bold">
                      {activeConversation.athleteName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/recruiting/athlete/${activeConversation.athleteId}`}
                          className="font-semibold hover:text-orange-400 transition-colors"
                        >
                          {activeConversation.athleteName}
                        </Link>
                        <TierBadge tier={activeConversation.athleteTier} size="sm" />
                      </div>
                      <p className="text-xs text-zinc-500">{activeConversation.athleteSchool}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={activeConversation.starred ? "text-yellow-400" : "text-zinc-400"}
                    >
                      <Star className={`w-4 h-4 ${activeConversation.starred ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "scout" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.sender === "scout"
                            ? "bg-orange-500 text-white rounded-br-md"
                            : "bg-zinc-800 text-zinc-100 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          message.sender === "scout" ? "text-orange-200" : "text-zinc-500"
                        }`}>
                          <span>{message.timestamp}</span>
                          {message.sender === "scout" && message.read && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-zinc-800">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="sm" className="text-zinc-400 mb-1">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 resize-none min-h-[44px] max-h-32"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 mb-1"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
