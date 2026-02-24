'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { User, Calendar, CreditCard } from 'lucide-react'

function PaymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedCustomerId = searchParams.get('customerId')

  const [customers, setCustomers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    customerId: preSelectedCustomerId || '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'cash',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/customers').then(res => res.json()).then(setCustomers)
  }, [])

  useEffect(() => {
    if (preSelectedCustomerId) {
        setFormData(prev => ({ ...prev, customerId: preSelectedCustomerId }))
    }
  }, [preSelectedCustomerId])

  const handleSubmit = async () => {
    if (!formData.customerId || !formData.amount) return alert('Fill required fields')

    setLoading(true)
    const res = await fetch('/api/payments', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      router.push(`/customers/${formData.customerId}`)
    } else {
      alert('Failed to save payment')
    }
    setLoading(false)
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> Customer / کسٹمر
            </label>
            <Select value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Amount / رقم
            </label>
            <Input
              type="number"
              placeholder="Enter Amount"
              className="text-lg font-bold h-14"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Method</label>
              <Select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="online">Online Transfer</option>
                <option value="check">Check</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Reference ID / Notes"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full h-14 text-lg shadow-xl shadow-primary/20" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save Payment / محفوظ کریں'}
      </Button>
    </div>
  )
}

export default function PaymentEntry() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
       <Header title="Payment / ادائیگی" />
       <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
         <PaymentForm />
       </Suspense>
    </div>
  )
}
