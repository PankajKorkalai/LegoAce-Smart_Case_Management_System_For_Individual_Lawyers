import { Link } from "react-router-dom";
import { Scale, ArrowRight, User } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="flex justify-center items-center gap-3 text-green-700 mx-auto">
          <Scale size={60} />
          <h1 className="text-5xl font-bold">LegoAce</h1>
        </div>
        
        <h2 className="text-2xl text-gray-600 font-medium">
          The ultimate legal workspace management system
        </h2>
        
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          Manage your cases, clients, documents, and calendar seamlessly in one intuitive dashboard alongside an integrated AI assistant.
        </p>

        <div className="flex justify-center items-center gap-6 mt-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Go to Dashboard <ArrowRight size={20} />
          </Link>
          
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-700 border border-green-700 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <User size={20} /> Login
          </Link>
        </div>
      </div>
    </div>
  );
}
