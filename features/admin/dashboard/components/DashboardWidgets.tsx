"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardIcons } from './DashboardIcons';

interface DashboardWidgetProps {
  title: string;
  count: number | null;
  loading?: boolean;
  icon?: React.ReactNode;
  href?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ 
  title, 
  count, 
  loading = false, 
  icon, 
  href 
}) => {
  const content = (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold">{count !== null ? count : '-'}</p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : content;
};

interface DashboardWidgetsProps {
  loading?: boolean;
  data?: {
    properties?: number;
    communities?: number;
    insights?: number;
    developers?: number;
    offplans?: number;
    agents?: number;
  };
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ loading = true, data = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardWidget 
        title="Properties" 
        count={data.properties || null} 
        loading={loading}
        icon={DashboardIcons.Properties}
        href="/admin/properties"
      />
      <DashboardWidget 
        title="Communities" 
        count={data.communities || null} 
        loading={loading}
        icon={DashboardIcons.Communities}
        href="/admin/communities"
      />
      <DashboardWidget 
        title="Insights" 
        count={data.insights || null} 
        loading={loading}
        icon={DashboardIcons.Insights}
        href="/admin/insights"
      />
      <DashboardWidget 
        title="Developers" 
        count={data.developers || null} 
        loading={loading}
        icon={DashboardIcons.Developers}
        href="/admin/developers"
      />
      <DashboardWidget 
        title="Off-Plans" 
        count={data.offplans || null} 
        loading={loading}
        icon={DashboardIcons.OffPlans}
        href="/admin/off-plans"
      />
      <DashboardWidget 
        title="Agents" 
        count={data.agents || null} 
        loading={loading}
        icon={DashboardIcons.Agents}
        href="/admin/agents"
      />
    </div>
  );
};

export default DashboardWidgets;
