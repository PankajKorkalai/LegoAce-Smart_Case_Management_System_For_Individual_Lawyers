import React from 'react';

export default function Profile() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500">Manage your personal information and view your performance</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          <button className="pb-3 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Personal Info</button>
          <button className="pb-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">Professional</button>
          <button className="pb-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">Activity</button>
        </nav>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Personal Information Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500 mt-0.5">Your personal details and contact information</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">Sarah</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">Johnson</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">sarah.johnson@legalflow.com</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">+1 (555) 123-4567</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">123 Legal Street, Suite 100, Los Angeles, CA 90001</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40">
              <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
              <p className="text-sm text-gray-500 mt-0.5">Tell clients a bit about yourself</p>
            </div>
            <div className="p-6">
              <div className="text-gray-700 bg-gray-50 px-4 py-4 rounded-lg border border-gray-200 leading-relaxed">
                Experienced family law attorney with over 10 years of practice. Specialized in divorce, child custody, and domestic relations cases. Committed to providing compassionate and effective legal representation to families during challenging times. Former family court mediator with extensive negotiation experience.
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-6 text-center border-b border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-semibold mb-4 shadow-md">
                SJ
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sarah Johnson</h3>
              <p className="text-blue-600 font-medium text-sm mt-0.5">Senior Partner</p>
              <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Family Law</div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-sm">
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium break-all">sarah.johnson@legalflow.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-sm">
                  <p className="text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-sm">
                  <p className="text-gray-500">Address</p>
                  <p className="text-gray-900 font-medium">123 Legal Street, Suite 100, Los Angeles, CA 90001</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-gray-100 mt-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-sm">
                  <p className="text-gray-500">Joined</p>
                  <p className="text-gray-900 font-medium">January 2015</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}