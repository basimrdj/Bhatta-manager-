'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="Dashboard / ڈیش بورڈ" showBack={false} />

      <div className="p-4 space-y-4">
        {/* Sales Card */}
        <Card className="bg-gradient-to-br from-primary to-[#ff6b3d] text-white border-none shadow-xl shadow-primary/20">
          <CardContent className="pt-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Today's Sales / آج کی فروخت</p>
              <h2 className="text-3xl font-bold mb-2">Rs. {data?.today?.salesAmount?.toLocaleString() || 0}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-sm hover:bg-white/30">
                  {data?.today?.salesCount || 0} Dispatches
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-sm hover:bg-white/30">
                  Collected: Rs. {data?.today?.cashCollected?.toLocaleString() || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Card */}
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Outstanding / بقایا جات</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rs. {data?.outstanding?.toLocaleString() || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Stock Summary */}
        <div>
          <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100">Stock Summary / اسٹاک</h3>
          <div className="grid grid-cols-2 gap-3">
            {data?.stock?.map((grade: any) => (
              <Card key={grade.id} className="border-l-4 border-l-primary overflow-hidden">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">{grade.name}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{grade.quantity?.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{grade.nameLocal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100">Recent Activity / حالیہ سرگرمیاں</h3>
          <div className="space-y-3">
            {data?.recent?.dispatches?.map((dispatch: any) => (
              <div key={`disp-${dispatch.id}`} className="bg-white dark:bg-[#2c1b15] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-primary flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Dispatch #{dispatch.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{dispatch.customer.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Rs. {dispatch.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(dispatch.dispatchDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {data?.recent?.payments?.map((payment: any) => (
              <div key={`pay-${payment.id}`} className="bg-white dark:bg-[#2c1b15] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Payment Received</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{payment.customer.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-600 dark:text-green-400">+ Rs. {payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}

            {(!data?.recent?.dispatches?.length && !data?.recent?.payments?.length) && (
               <p className="text-center text-slate-400 text-sm py-4">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
