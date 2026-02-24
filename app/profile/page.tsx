'use client'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut, Database, Shield } from 'lucide-react'

export default function Profile() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header title="Profile / پروفائل" showBack={false} />

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 border-4 border-white dark:border-slate-800 shadow-sm">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kiln Owner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">admin@example.com</p>
          <div className="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
            Admin Role
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">Settings / سیٹنگز</p>
                    <p className="text-xs text-slate-500">App preferences</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                  <Database className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">Data Backup</p>
                    <p className="text-xs text-slate-500">Export your data</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">Security</p>
                    <p className="text-xs text-slate-500">Change password</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full h-12 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-100 dark:border-red-900/20">
            <LogOut className="w-4 h-4 mr-2" />
            Logout / لاگ آؤٹ
          </Button>

          <p className="text-center text-xs text-slate-400 pt-4">
            Bhatta Manager v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
