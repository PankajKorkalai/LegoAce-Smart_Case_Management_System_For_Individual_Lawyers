import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, RotateCcw, FileText, Scale, AlertTriangle, Lightbulb, User } from "lucide-react";
import axios from "axios";

export default function AI() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI legal assistant. I can help you with case analysis, document summarization, legal research, and strategic recommendations based on your uploaded documents. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        message: userMessage.text
      });
      
      setMessages((prev) => [
        ...prev, 
        { sender: "bot", text: resp.data.answer }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      
      let debugMessage = "Network Error, backend might be down.";
      if (error.response && error.response.data) {
         debugMessage = `Backend Error: ${error.response.data.error || ''} | Details: ${error.response.data.details || ''}`;
      }

      setMessages((prev) => [
        ...prev, 
        { sender: "bot", text: `⚠️ System Error: ${debugMessage}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([messages[0]]); // keep only intro
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="grid grid-cols-3 gap-6">
        
        {/* LEFT: Chat Section */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[80vh]">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 text-white rounded-lg flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="font-semibold">AI Legal Assistant</h2>
                <p className="text-xs text-gray-500">
                  Powered by advanced legal AI
                </p>
              </div>
            </div>

            <button onClick={handleClear} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-700">
              <RotateCcw size={14} /> Clear Chat
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-gray-800 text-white" : "bg-green-700 text-white"}`}>
                  {msg.sender === "user" ? <User size={14} /> : <Sparkles size={14} />}
                </div>

                <div className={`${msg.sender === "user" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"} px-4 py-3 rounded-xl max-w-lg text-sm shadow-sm`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center shrink-0">
                  <Sparkles size={14} />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-xl text-sm text-gray-500 animate-pulse w-32">
                  Searching files...
                </div>
              </div>
            )}

          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about cases, documents, or legal research..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-green-600 transition-colors text-sm"
              disabled={isLoading}
            />

            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-6">
          
          {/* Suggested Queries */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-4">Suggested Queries</h3>

            <div className="space-y-3 text-sm">
              
              <div onClick={() => { setInput("Summarize the key points from the initial complaint"); }} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 transition-all flex gap-3 items-start">
                <FileText size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Document Analysis</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Summarize the key points from the initial complaint
                  </p>
                </div>
              </div>

              <div onClick={() => { setInput("What are the precedents for breach of contract cases?"); }} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 transition-all flex gap-3 items-start">
                <Scale size={16} className="text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Legal Research</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    What are the precedents for breach of contract cases?
                  </p>
                </div>
              </div>

              <div onClick={() => { setInput("What are the potential risks in the latest case?"); }} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 transition-all flex gap-3 items-start">
                <AlertTriangle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Risk Assessment</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    What are the potential risks in the latest case?
                  </p>
                </div>
              </div>

              <div onClick={() => { setInput("Recommend a negotiation strategy for the dispute"); }} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 transition-all flex gap-3 items-start">
                <Lightbulb size={16} className="text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Strategy Advice</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Recommend a negotiation strategy for the dispute
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* AI Capabilities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-4">AI Capabilities</h3>

            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-2"><Scale size={14} className="text-gray-400"/> Legal Research</li>
              <li className="flex items-center gap-2"><FileText size={14} className="text-gray-400"/> Document Analysis</li>
              <li className="flex items-center gap-2"><Lightbulb size={14} className="text-gray-400"/> Case Strategy</li>
              <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-gray-400"/> Risk Assessment</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}