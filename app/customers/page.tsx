'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, User, MapPin } from 'lucide-react'

export default function CustomerList() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data)
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
       <Header title="Customers / کسٹمرز" />

       <div className="p-4 space-y-3">
         {loading ? (
            <div className="text-center py-10">Loading...</div>
         ) : (
            customers.map(c => (
               <Link key={c.id} href={`/customers/${c.id}`}>
                 <Card className="hover:shadow-md transition-shadow">
                   <CardContent className="p-4 flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                       <User className="w-6 h-6 text-slate-500" />
                     </div>
                     <div className="flex-1">
                       <p className="font-bold text-slate-900 dark:text-slate-100">{c.name}</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{c.phone}</p>
                       {c.siteLocation && (
                         <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                           <MapPin className="w-3 h-3" /> {c.siteLocation}
                         </p>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               </Link>
            ))
         )}

         {!loading && customers.length === 0 && (
            <div className="text-center py-10 text-slate-500">No customers found.</div>
         )}
       </div>
    </div>
  )
}
