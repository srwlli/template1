'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Metric Card Component for dashboard stats
const MetricCard = ({ title, value, change, changeColor, icon, iconBg }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${iconBg} rounded-md flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className={`${changeColor} font-medium`}>{change.split(' ')[0]}</span>
          <span className="text-gray-500"> {change.split(' ').slice(1).join(' ')}</span>
        </div>
      </div>
    </Card>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ title, description, icon, iconBg, bgColor, hoverColor, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 ${bgColor} ${hoverColor} rounded-md transition-colors`}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 ${iconBg} rounded-md flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

// Activity Item Component
const ActivityItem = ({ title, description, time, icon, iconBg }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your account.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value="1,234"
            change="+12% from last month"
            changeColor="text-green-600"
            iconBg="bg-blue-500"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />

          <MetricCard
            title="Revenue"
            value="$45,678"
            change="+8% from last month"
            changeColor="text-green-600"
            iconBg="bg-green-500"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />

          <MetricCard
            title="Active Projects"
            value="24"
            change="3 new this week"
            changeColor="text-blue-600"
            iconBg="bg-purple-500"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <MetricCard
            title="Completion Rate"
            value="87%"
            change="+5% from last month"
            changeColor="text-green-600"
            iconBg="bg-orange-500"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionButton
                  title="Create New Project"
                  description="Start a new project"
                  bgColor="bg-blue-50"
                  hoverColor="hover:bg-blue-100"
                  iconBg="bg-blue-500"
                  onClick={() => alert('Create new project clicked!')}
                  icon={
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  }
                />

                <QuickActionButton
                  title="Generate Report"
                  description="Create analytics report"
                  bgColor="bg-green-50"
                  hoverColor="hover:bg-green-100"
                  iconBg="bg-green-500"
                  onClick={() => alert('Generate report clicked!')}
                  icon={
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />

                <QuickActionButton
                  title="Invite Team Member"
                  description="Add new team member"
                  bgColor="bg-purple-50"
                  hoverColor="hover:bg-purple-100"
                  iconBg="bg-purple-500"
                  onClick={() => alert('Invite team member clicked!')}
                  icon={
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes in your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ActivityItem
                  title="New project created"
                  description="Website redesign project was created by John Doe"
                  time="2 hours ago"
                  iconBg="bg-blue-100"
                  icon={
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  }
                />

                <ActivityItem
                  title="Task completed"
                  description="Mobile app wireframes task was completed"
                  time="4 hours ago"
                  iconBg="bg-green-100"
                  icon={
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                />

                <ActivityItem
                  title="Team member joined"
                  description="Sarah Wilson joined the development team"
                  time="1 day ago"
                  iconBg="bg-purple-100"
                  icon={
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />

                <ActivityItem
                  title="System maintenance"
                  description="Scheduled maintenance completed successfully"
                  time="2 days ago"
                  iconBg="bg-orange-100"
                  icon={
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}