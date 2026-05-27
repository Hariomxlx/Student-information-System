import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Dummy events
  const events = [
    { date: 5, title: 'Database Systems Exam', time: '10:00 AM', type: 'exam', color: 'bg-red-500' },
    { date: 12, title: 'Mentor Meeting', time: '2:00 PM', type: 'meeting', color: 'bg-blue-500' },
    { date: 18, title: 'Assignment Due: AI', time: '11:59 PM', type: 'deadline', color: 'bg-amber-500' },
    { date: 22, title: 'Hackathon Starts', time: '9:00 AM', type: 'event', color: 'bg-emerald-500' },
    { date: 25, title: 'Project Presentation', time: '3:30 PM', type: 'meeting', color: 'bg-purple-500' },
  ];

  const renderCells = () => {
    const cells = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2 md:p-4 min-h-[100px] bg-slate-800/30 border border-slate-800/50 rounded-xl"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() && 
        currentDate.getFullYear() === new Date().getFullYear();
        
      const dayEvents = events.filter(e => e.date === day);
      
      cells.push(
        <div 
          key={day} 
          className={`p-2 md:p-4 min-h-[100px] border border-slate-700/50 rounded-xl transition-all hover:bg-slate-800/80 cursor-pointer ${
            isToday ? 'bg-blue-900/20 ring-1 ring-blue-500/50' : 'bg-slate-800/50'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`font-medium flex h-7 w-7 items-center justify-center rounded-full ${
              isToday ? 'bg-blue-500 text-white' : 'text-slate-300'
            }`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {dayEvents.map((evt, idx) => (
              <div key={idx} className={`text-[10px] md:text-xs p-1.5 rounded-md truncate text-white shadow-sm ${evt.color}/80 border border-${evt.color}/30 backdrop-blur-sm`}>
                {evt.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <CalendarIcon className="h-7 w-7" />
            </div>
            Academic Calendar
          </h2>
          <p className="text-slate-400 mt-1">Manage your classes, exams, and deadlines.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold w-40 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {renderCells()}
          </div>
        </div>
        
        {/* Upcoming Events Sidebar */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            Upcoming This Month
          </h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {events.sort((a, b) => a.date - b.date).map((evt, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded flex-shrink-0 ${evt.color} text-white`}>
                    {evt.type}
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {monthNames[currentDate.getMonth()].substring(0, 3)} {evt.date}
                  </div>
                </div>
                <h4 className="font-medium text-slate-200 mb-2 leading-tight">{evt.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{evt.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20">
            + Add New Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
