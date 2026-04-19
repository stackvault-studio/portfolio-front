import { useState, useEffect } from "react";
import Header from '../../components/ui/Header';
import ScrollProgressIndicator from '../../components/ui/ScrollProgressIndicator';
import SessionSidebar from './SessionSidebar';
import { useLanguage } from '../../contexts/LanguageContext';
import { chatService } from '../../services/chatService';
import Icon from '../../components/AppIcon'; // adjust path if needed

const ChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const { language } = useLanguage();

  // Translation objects
  const translations = {
    title: language === 'fr' ? 'Chatbot IA Recruteur' : 'AI Recruiter Chat',
    subtitle: language === 'fr' ? 'Posez des questions sur Oussama Abdennadher' : 'Ask anything about Oussama Abdennadher',
    placeholder: language === 'fr' ? 'Posez des questions sur mon expérience, compétences ou disponibilité...' : 'Ask anything about my experience, skills, or availability...',
    sendButton: language === 'fr' ? 'Envoyer' : 'Send',
    loadingText: language === 'fr' ? 'Réflexion...' : 'Thinking...',
    errorMessage: language === 'fr' ? 'Désolé, une erreur est survenue. Veuillez réessayer.' : 'Sorry, something went wrong. Please try again.',
  };

  // Session Management API Functions
  const createSession = async () => {
    try {
      const data = await chatService.createSession();
      setCurrentSessionId(data.session_id);
      setMessages([]);
      
      // Refresh sessions list
      getSessions();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const getSessions = async () => {
    setSessionsLoading(true);
    try {
      const sessionsData = await chatService.getSessions();
      setSessions(sessionsData);
      
      // Auto-select first session if none selected
      if (!currentSessionId && sessionsData.length > 0) {
        setCurrentSessionId(sessionsData[0].session_id);
      }
    } catch (error) {
      console.error('Failed to get sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const getSessionHistory = async (sessionId) => {
    try {
      const messagesData = await chatService.getSessionHistory(sessionId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to get session history:', error);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await chatService.deleteSession(sessionId);
      
      // Remove from sessions list
      setSessions(prev => prev.filter(session => session.session_id !== sessionId));
      
      // If deleted session was current, switch to first available or create new
      if (currentSessionId === sessionId) {
        if (sessions.length > 1) {
          const newSession = sessions.find(session => session.session_id !== sessionId);
          setCurrentSessionId(newSession.session_id);
          getSessionHistory(newSession.session_id);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // Session Management Functions
  const handleCreateSession = () => {
    createSession();
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    getSessionHistory(sessionId);
  };

  const handleDeleteSession = (sessionId) => {
    deleteSession(sessionId);
  };

  // Load sessions on component mount
  useEffect(() => {
    getSessions();
  }, []);

  // Load session history when current session changes
  useEffect(() => {
    if (currentSessionId) {
      getSessionHistory(currentSessionId);
    }
  }, [currentSessionId]);

  const sendMessage = async () => {
    if (!input.trim() || !currentSessionId) return;

    const newMessage = { role: "user", content: input };

    // Update UI immediately
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await chatService.sendMessage(currentSessionId, input);

      const assistantMessage = {
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: translations.errorMessage,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollProgressIndicator />
      <main className="pt-16">
        <section className="relative min-h-screen bg-gradient-to-b from-background to-muted/10 flex">
          {/* Session Sidebar */}
          <SessionSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onCreateSession={handleCreateSession}
            onDeleteSession={handleDeleteSession}
            onSelectSession={handleSelectSession}
            loading={sessionsLoading}
          />

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b border-border bg-card/50 backdrop-blur-md">
              <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">{translations.title}</h1>
                <span className="text-sm text-muted-foreground">
                  {translations.subtitle}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-card border border-border px-4 py-3 rounded-2xl shadow-sm text-muted-foreground">
                      <span className="animate-pulse">{translations.loadingText}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar */}
            <div className="sticky bottom-0 left-0 right-0 z-[1000] bg-background/95 backdrop-blur-sm border-t border-border">
              <div className="max-w-5xl mx-auto px-6 py-4">
                <div className="flex items-center space-x-3 bg-muted/30 border border-border rounded-xl px-4 py-3">
                  <input
                    type="text"
                    placeholder={translations.placeholder}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center space-x-2"
                  >
                    <span>{translations.sendButton}</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AO</span>
              </div>
              <span className="text-lg font-semibold text-foreground">Abdennadher Oussama</span>
            </div>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Développeur FullStack Senior • Spécialiste Java & BPM' : 'Senior FullStack Developer • Java & BPM Specialist'}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} Abdennadher Oussama</span>
              <span>•</span>
              <span>{language === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;