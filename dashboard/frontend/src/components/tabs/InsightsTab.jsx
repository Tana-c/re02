import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const InsightsTab = ({ insightsData }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort function to sort by P1, P2, P3... P25
  const sortByPersonaId = (a, b) => {
    const getNumber = (id) => {
      const match = id?.match(/P(\d+)/);
      return match ? parseInt(match[1], 10) : 999;
    };
    return getNumber(a.id) - getNumber(b.id);
  };

  // Filter and sort insights
  const filteredInsights = insightsData
    .filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.id?.toLowerCase().includes(searchLower) ||
        item.role?.toLowerCase().includes(searchLower) ||
        item.want?.toLowerCase().includes(searchLower) ||
        item.but?.toLowerCase().includes(searchLower) ||
        item.so?.toLowerCase().includes(searchLower)
      );
    })
    .sort(sortByPersonaId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Persona Insights Matrix</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาอาชีพ หรือความต้องการ..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredInsights.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-slate-500">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInsights.map((person) => (
            <div key={person.id} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/6">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">{person.id}</div>
                  <h3 className="font-bold text-slate-800">{person.role || 'ไม่ระบุ'}</h3>
                </div>
                <div className="md:w-5/6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">People Want</span>
                    <p className="text-sm text-slate-700 mt-1">{person.want || 'ไม่ระบุ'}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">But... (Conflict)</span>
                    <p className="text-sm text-slate-700 mt-1">{person.but || 'ไม่ระบุ'}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">So They... (Action)</span>
                    <p className="text-sm text-slate-700 mt-1">{person.so || 'ไม่ระบุ'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
