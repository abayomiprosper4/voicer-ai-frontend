"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, Mic2, Download } from "lucide-react";
import { 
  getAdminStats, 
  getSubmissionTrends, 
  getLanguageDistribution, 
  getReviewerActivity 
} from "@/lib/mock/admin";

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const trends = getSubmissionTrends();
  const langDist = getLanguageDistribution();
  const activity = getReviewerActivity();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform-wide metrics and dataset insights.</p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Reviewers</CardTitle>
            <Mic2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReviewers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Submission Trends</h2>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monday to Friday Submissions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <svg viewBox="0 0 500 300" className="w-full max-h-64 overflow-visible">
              {/* Grid Lines */}
              {[0, 10, 20, 30].map(y => (
                <line key={y} x1="0" y1={300 - (y * 10)} x2="500" y2={300 - (y * 10)} stroke="currentColor" className="text-border" strokeDasharray="4" />
              ))}
              
              {/* Line A */}
              <polyline 
                fill="none" 
                stroke="currentColor" 
                className="text-primary" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trends.map((p, i) => `${(i / 5) * 500},${300 - (p.seriesA * 10)}`).join(" ")} 
              />
              {/* Line B */}
              <polyline 
                fill="none" 
                stroke="currentColor" 
                className="text-emerald-500" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trends.map((p, i) => `${(i / 5) * 500},${300 - (p.seriesB * 10)}`).join(" ")} 
              />
              {/* Line C */}
              <polyline 
                fill="none" 
                stroke="currentColor" 
                className="text-amber-500" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trends.map((p, i) => `${(i / 5) * 500},${300 - (p.seriesC * 10)}`).join(" ")} 
              />
            </svg>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Language Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between h-64 pt-6 gap-2">
            {langDist.map((item, i) => (
              <div key={i} className="flex gap-1 flex-1 h-full items-end justify-center">
                <div className="w-2 md:w-4 bg-primary rounded-t-sm" style={{ height: `${item.english}%` }} />
                <div className="w-2 md:w-4 bg-amber-400 rounded-t-sm" style={{ height: `${item.yoruba}%` }} />
                <div className="w-2 md:w-4 bg-emerald-500 rounded-t-sm" style={{ height: `${item.pidgin}%` }} />
                <div className="w-2 md:w-4 bg-foreground/20 rounded-t-sm" style={{ height: `${item.other}%` }} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-8">
        <h2 className="text-xl font-semibold text-foreground">Recent Reviewer Activity Table</h2>
      </div>

      {/* Activity Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-primary-foreground bg-primary">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email address</th>
                <th className="px-6 py-4 font-semibold">Date Joined</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activity.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors bg-card even:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">{row.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.dateJoined}</td>
                  <td className="px-6 py-4 capitalize">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        row.status === 'approved' ? 'bg-emerald-500' :
                        row.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className={`${
                        row.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' :
                        row.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
