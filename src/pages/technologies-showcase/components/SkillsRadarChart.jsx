import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const SkillsRadarChart = ({ data }) => {
  // Custom tooltip with rounded values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => {
            let value = entry.value;
            if (entry.dataKey === 'experience') {
              value = `${Math.round(value * 10) / 10} y`; // round to 1 decimal
            } else if (entry.dataKey === 'proficiency') {
              value = `${Math.round(value)}%`; // round to integer percentage
            }
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Skills Overview</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-xs text-muted-foreground">Experience</span>
          <div className="w-3 h-3 bg-secondary rounded-full"></div>
          <span className="text-xs text-muted-foreground">Proficiency</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: 'rgb(148, 163, 184)' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'rgb(148, 163, 184)' }}
            />
            <Radar
              name="Experience"
              dataKey="experience"
              stroke="rgb(59, 130, 246)"
              fill="rgb(59, 130, 246)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Proficiency"
              dataKey="proficiency"
              stroke="rgb(139, 92, 246)"
              fill="rgb(139, 92, 246)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsRadarChart;