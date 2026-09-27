import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { StatusBreakdown } from '../types/ticket';

interface TicketChartProps {
  data: StatusBreakdown[];
}

export const TicketChart: React.FC<TicketChartProps> = ({ data }) => {
  const hasData = data && data.some(item => item.count > 0);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-800">Tickets by Status</h3>
        <p className="text-xs text-slate-500 mt-0.5">Real-time status breakdown across system</p>
      </div>

      <div className="h-64 w-full my-4 flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 italic">No tickets available to render chart</p>
        )}
      </div>
    </div>
  );
};
