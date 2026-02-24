'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Calendar, ArrowDownLeft, ArrowUpRight, MessageSquare, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CustomerLedger() {
  const { id } = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/customers/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error(data.error)
            return
          }
          setCustomer(data)
          // Merge transactions
          const dispatches = data.dispatches.map((d: any) => ({
            ...d,
            type: 'dispatch',
            date: d.dispatchDate,
            amount: d.totalAmount,
            ref: `Challan #${d.id}`
          }))
          const payments = data.payments.map((p: any) => ({
            ...p,
            type: 'payment',
            date: p.date,
            amount: p.amount,
            ref: `Receipt #${p.id}`
          }))
          const all = [...dispatches, ...payments].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setTransactions(all)
          setLoading(false)
        })
        .catch(err => console.error(err))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!customer) return <div className="p-4 text-center">Customer not found</div>

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
       <Header title="Customer Ledger / کھاتہ" />

       <div className="bg-white dark:bg-[#2c1b15] pb-6 px-4 pt-2 mb-4 flex flex-col items-center text-center shadow-sm relative">
         <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-background-light dark:border-background-dark shadow-lg mb-3 flex items-center justify-center text-3xl font-bold text-slate-400">
            {customer.name.charAt(0).toUpperCase()}
         </div>
         <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{customer.name}</h1>
         <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 flex items-center gap-1 justify-center">
           <MapPin className="w-3 h-3" /> {customer.siteLocation || 'No Site Location'}
         </p>
         <p className="text-slate-400 dark:text-slate-500 text-xs mb-5">
            Registered: {new Date(customer.createdAt).toLocaleDateString()}
         </p>

         <div className="flex w-full gap-3 max-w-sm">
           <Button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-none hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => window.location.href = `tel:${customer.phone}`}>
             <Phone className="w-4 h-4 mr-2" /> Call / کال
           </Button>
           <Button
             className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-green-500/20"
             onClick={() => {
               const phone = customer.phone.replace(/^0/, '92').replace(/\D/g, '')
               window.open(`https://wa.me/${phone}`, '_blank')
             }}
           >
             <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
           </Button>
         </div>
       </div>

       {/* Balance Card */}
       <div className="px-4 mb-6">
         <div className="bg-gradient-to-br from-primary to-[#ff6b3d] rounded-2xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-xl"></div>
           <div className="relative z-10 flex flex-col items-center text-center">
             <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Current Balance / موجودہ بیلنس</p>
             <h2 className="text-3xl font-bold mb-2">Rs. {customer.totalBalance?.toLocaleString() || 0}</h2>

             {customer.totalBalance > 0 && (
               <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                 <AlertCircle className="w-4 h-4" />
                 <span>Payment Due / ادائیگی باقی ہے</span>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Transactions */}
       <div className="px-4 pb-20">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Transactions <span className="text-sm font-normal text-slate-400 ml-1">/ حالیہ لین دین</span>
            </h3>
         </div>

         <div className="space-y-3">
           {transactions.map((t) => (
              <div key={`${t.type}-${t.id}`} className="bg-white dark:bg-[#2c1b15] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm flex items-start justify-between">
                <div className="flex items-start gap-3">
                   <div className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                     t.type === 'dispatch' ? "bg-red-50 dark:bg-red-900/20 text-red-500" : "bg-green-50 dark:bg-green-900/20 text-green-600"
                   )}>
                     {t.type === 'dispatch' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                       {t.type === 'dispatch' ? 'Bricks Dispatch' : 'Payment Received'}
                     </p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                       {t.ref} • {new Date(t.date).toLocaleDateString()}
                     </p>
                     {t.type === 'dispatch' && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Items: {t.items?.length || 0} • Status: {t.status}
                        </p>
                     )}
                   </div>
                </div>
                <div className="text-right">
                   <p className={cn("font-bold", t.type === 'dispatch' ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
                     {t.type === 'dispatch' ? '-' : '+'} Rs. {t.amount.toLocaleString()}
                   </p>
                   {t.type === 'dispatch' && t.balanceDue > 0 && (
                     <p className="text-[10px] text-orange-500 mt-1 font-semibold">Due: {t.balanceDue.toLocaleString()}</p>
                   )}
                </div>
              </div>
           ))}
           {transactions.length === 0 && (
             <p className="text-center text-slate-400 py-8">No transactions yet.</p>
           )}
         </div>
       </div>
    </div>
  )
}
