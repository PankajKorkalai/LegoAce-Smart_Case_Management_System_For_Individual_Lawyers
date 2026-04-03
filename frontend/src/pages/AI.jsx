import { Sparkles, Send, RotateCcw } from "lucide-react";

export default function AI() {
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

            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
              <RotateCcw size={14} /> Clear Chat
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            
            {/* Bot Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center">
                <Sparkles size={14} />
              </div>

              <div className="bg-gray-100 px-4 py-3 rounded-xl max-w-lg text-sm">
                Hello! I'm your AI legal assistant. I can help you with case
                analysis, document summarization, legal research, and strategic
                recommendations. How can I assist you today?
                <div className="text-xs text-gray-400 mt-2">22:50</div>
              </div>
            </div>

          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <input
              type="text"
              placeholder="Ask about cases, documents, or legal research..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 outline-none text-sm"
            />

            <button className="bg-green-700 text-white p-2 rounded-lg hover:bg-green-800 transition">
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-6">
          
          {/* Suggested Queries */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-4">Suggested Queries</h3>

            <div className="space-y-3 text-sm">
              
              <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <p className="font-medium">📄 Document Analysis</p>
                <p className="text-gray-500 text-xs">
                  Summarize the key points from the Smith vs Johnson initial complaint
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <p className="font-medium">⚖️ Legal Research</p>
                <p className="text-gray-500 text-xs">
                  What are the precedents for breach of contract cases in California?
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <p className="font-medium">⚠️ Risk Assessment</p>
                <p className="text-gray-500 text-xs">
                  What are the potential risks in the Tech Corp patent case?
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <p className="font-medium">💡 Strategy Advice</p>
                <p className="text-gray-500 text-xs">
                  Recommend a negotiation strategy for the Davis property dispute
                </p>
              </div>

            </div>
          </div>

          {/* AI Capabilities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-4">AI Capabilities</h3>

            <ul className="text-sm text-gray-600 space-y-2">
              <li>🔍 Legal Research</li>
              <li>📄 Document Analysis</li>
              <li>⚖️ Case Strategy</li>
              <li>📊 Risk Assessment</li>
              <li>✍️ Drafting Assistance</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}