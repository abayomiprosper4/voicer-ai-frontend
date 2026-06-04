"use client";

import { Bell, UserCircle, Search, Trash2 } from "lucide-react";
import {
  getAdminStats,
  getReviewerActivity,
  getSubmissionTrends,
  getLanguageDistribution,
  type TrendPoint,
  type LangDistribution,
} from "@/lib/mock/admin";
import { cn } from "@/lib/utils";

function LineChart({ data }: { data: TrendPoint[] }) {
  const width = 500;
  const height = 200;
  const maxY = 32;

  const getPoints = (seriesKey: keyof Omit<TrendPoint, "day">) => {
    return data
      .map((d, i) => {
        const x = (i / 5) * width;
        const y = height - (d[seriesKey] / maxY) * height;
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <svg viewBox="-20 -10 540 230" className="w-full h-auto min-h-[250px]">
      {/* Grid lines */}
      {[0, 8, 16, 24, 32].map((y) => {
        const yCoord = height - (y / maxY) * height;
        return (
          <g key={y}>
            <text
              x="-5"
              y={yCoord + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
              className="text-muted-foreground"
            >
              {y}
            </text>
            <line
              x1="10"
              y1={yCoord}
              x2={width}
              y2={yCoord}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </g>
        );
      })}
      {/* X axis labels */}
      {[0, 1, 2, 3, 4, 5].map((x) => {
        const xCoord = (x / 5) * width;
        return (
          <text
            key={x}
            x={xCoord}
            y={height + 20}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {x}
          </text>
        );
      })}

      {/* Lines */}
      <polyline
        points={getPoints("seriesA")}
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
      />
      <polyline
        points={getPoints("seriesB")}
        fill="none"
        stroke="currentColor"
        className="text-emerald-500"
        strokeWidth="2"
      />
      <polyline
        points={getPoints("seriesC")}
        fill="none"
        stroke="currentColor"
        className="text-amber-400"
        strokeWidth="2"
      />

      {/* Data points */}
      {(["seriesA", "seriesB", "seriesC"] as const).map((seriesKey, sIdx) =>
        data.map((d, i) => {
          const x = (i / 5) * width;
          const y = height - (d[seriesKey] / maxY) * height;
          const colorClass =
            sIdx === 0
              ? "text-primary"
              : sIdx === 1
                ? "text-emerald-500"
                : "text-amber-400";
          return (
            <circle
              key={`${seriesKey}-${i}`}
              cx={x}
              cy={y}
              r="3"
              fill="currentColor"
              className={colorClass}
            />
          );
        })
      )}
    </svg>
  );
}

function BarChart({ data }: { data: LangDistribution[] }) {
  const width = 500;
  const height = 200;
  const maxY = 100;
  const groupWidth = width / 6;
  const barWidth = 10;
  const barGap = 2;
  const colors = [
    "text-amber-400",
    "text-primary",
    "text-emerald-500",
    "text-cta",
  ];
  const keys = ["english", "yoruba", "pidgin", "other"] as const;

  return (
    <svg viewBox="-20 -10 540 230" className="w-full h-auto min-h-[250px]">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => {
        const yCoord = height - (y / maxY) * height;
        return (
          <g key={y}>
            <text
              x="-5"
              y={yCoord + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
              className="text-muted-foreground"
            >
              {y}
            </text>
            <line
              x1="10"
              y1={yCoord}
              x2={width}
              y2={yCoord}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </g>
        );
      })}

      {/* X axis labels */}
      {[0, 1, 2, 3, 4, 5].map((x) => {
        const xCoord = x * groupWidth + groupWidth / 2;
        return (
          <text
            key={x}
            x={xCoord}
            y={height + 20}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {x}
          </text>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const groupX =
          i * groupWidth + (groupWidth - (4 * barWidth + 3 * barGap)) / 2;
        return keys.map((k, j) => {
          const val = d[k];
          const barH = (val / maxY) * height;
          const x = groupX + j * (barWidth + barGap);
          const y = height - barH;
          return (
            <rect
              key={`${i}-${k}`}
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              fill="currentColor"
              className={colors[j]}
            />
          );
        });
      })}
    </svg>
  );
}

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const reviewerActivity = getReviewerActivity();
  const trends = getSubmissionTrends();
  const langDist = getLanguageDistribution();

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="relative flex items-center justify-center pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <div className="absolute right-0 flex items-center gap-3 text-muted-foreground">
          <button
            aria-label="Notifications"
            className="rounded-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell className="h-6 w-6" />
          </button>
          <button
            aria-label="Profile"
            className="rounded-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <UserCircle className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="relative mx-auto w-full max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-border bg-secondary py-3 pl-6 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "TOTAL USERS", value: stats.totalUsers },
          { label: "TOTAL PROJECTS", value: stats.totalProjects },
          { label: "TOTAL REVIEWERS", value: stats.totalReviewers },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl border border-border bg-card py-6 shadow-sm"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <span className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Trends */}
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-xl font-semibold text-foreground">
          Submission Trends
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-4">
            <LineChart data={trends} />
            <p className="text-center text-sm text-foreground">
              Monday to Friday submissions
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <BarChart data={langDist} />
            <p className="text-center text-sm text-foreground">
              Language Distribution
            </p>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-xl font-semibold text-foreground">
          Recent Reviewer Activity Table
        </h2>
        <div className="w-full overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[800px] text-left text-sm text-foreground">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="w-12 rounded-tl-xl px-4 py-3 text-center font-semibold">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email address</th>
                <th className="px-4 py-3 font-semibold">Date Joined</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="rounded-tr-xl px-4 py-3 font-semibold">
                  Delete User
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {reviewerActivity.map((activity, index) => {
                const isApproved = activity.status === "approved";
                const isPending = activity.status === "pending";
                const isRejected = activity.status === "rejected";

                return (
                  <tr
                    key={activity.id}
                    className={cn(
                      "border-b border-border transition-colors",
                      index % 2 === 0 ? "bg-secondary/30" : "bg-card",
                      index === reviewerActivity.length - 1 && "border-none"
                    )}
                  >
                    <td className="w-12 px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                        aria-label={`Select user ${activity.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">{activity.name}</td>
                    <td className="px-4 py-3">{activity.email}</td>
                    <td className="px-4 py-3">{activity.dateJoined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            isApproved && "bg-emerald-500",
                            isPending && "bg-amber-400",
                            isRejected && "bg-red-500"
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium capitalize",
                            isApproved && "text-emerald-600",
                            isPending && "text-amber-500",
                            isRejected && "text-red-500"
                          )}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center sm:text-left">
                      <button
                        type="button"
                        className="ml-4 rounded-md text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Delete user ${activity.name}`}
                      >
                        <Trash2 className="mx-auto h-5 w-5 sm:mx-0" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Data Button */}
      <button
        type="button"
        className="mx-auto w-full max-w-lg rounded-full bg-cta py-4 text-lg font-semibold text-cta-foreground transition-colors hover:bg-cta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Export data
      </button>
    </div>
  );
}
