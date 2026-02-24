'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Calendar, User, Truck } from 'lucide-react'

export default function DispatchEntry() {
  const router = useRouter()
  const [customers, setCustomers] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Form State
  const [customerId, setCustomerId] = useState('')
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState([{ gradeId: '', quantity: '', rate: '', amount: 0 }])
  const [paymentType, setPaymentType] = useState('credit')
  const [amountReceived, setAmountReceived] = useState('')
  const [vehicleType, setVehicleType] = useState('Tractor')

  // Fetch Data
  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(res => res.json()),
      fetch('/api/stock').then(res => res.json())
    ]).then(([custData, stockData]) => {
      setCustomers(custData)
      setGrades(stockData)
    })
  }, [])

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalAmount = subtotal

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto calc amount
    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity) || 0
      const rate = parseFloat(newItems[index].rate) || 0
      // Rate is per 1000 usually
      newItems[index].amount = (qty * rate) / 1000
    }

    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { gradeId: '', quantity: '', rate: '', amount: 0 }])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleGradeChange = (index: number, gradeId: string) => {
    const grade = grades.find(g => g.id.toString() === gradeId)
    const newItems = [...items]
    newItems[index].gradeId = gradeId
    if (grade && grade.defaultRate) {
        newItems[index].rate = grade.defaultRate
        // Recalc amount
        const qty = parseFloat(newItems[index].quantity) || 0
        newItems[index].amount = (qty * grade.defaultRate) / 1000
    }
    setItems(newItems)
  }

  const handleSubmit = async () => {
    if (!customerId) return alert('Please select a customer')
    if (items.some(i => !i.gradeId || !i.quantity)) return alert('Please fill all item details')

    setLoading(true)
    const payload = {
      customerId,
      dispatchDate,
      items: items.map(i => ({
        gradeId: i.gradeId,
        quantity: i.quantity,
        rate: i.rate,
        amount: i.amount,
        unit: 'pieces'
      })),
      paymentType,
      amountReceived: paymentType === 'credit' ? 0 : amountReceived,
      subtotal,
      totalAmount,
      vehicleType
    }

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        router.push('/')
      } else {
        const err = await res.json()
        alert('Failed: ' + (err.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Error saving dispatch')
    }
    setLoading(false)
  }

  return (
     <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
       <Header title="New Dispatch / نئی ترسیل" />

       <div className="p-4 space-y-6">
         {/* Customer & Date */}
         <Card>
           <CardContent className="p-4 space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2">
                 <User className="w-4 h-4" /> Customer / کسٹمر
               </label>
               <Select value={customerId} onChange={e => setCustomerId(e.target.value)}>
                 <option value="">Select Customer</option>
                 {customers.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </Select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium flex items-center gap-2">
                     <Calendar className="w-4 h-4" /> Date
                   </label>
                   <Input type="date" value={dispatchDate} onChange={e => setDispatchDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium flex items-center gap-2">
                     <Truck className="w-4 h-4" /> Vehicle
                   </label>
                   <Select value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                     <option value="Tractor">Tractor Trolley</option>
                     <option value="Truck">Truck</option>
                     <option value="Pickup">Pickup</option>
                   </Select>
                </div>
             </div>
           </CardContent>
         </Card>

         {/* Items */}
         <div className="space-y-3">
           <div className="flex justify-between items-center">
             <h3 className="font-bold">Items / سامان</h3>
             <Button size="sm" variant="ghost" onClick={addItem} className="text-primary">
               <Plus className="w-4 h-4 mr-1" /> Add Item
             </Button>
           </div>

           {items.map((item, index) => (
             <Card key={index} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 h-8 w-8"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Grade / قسم</label>
                    <Select value={item.gradeId} onChange={e => handleGradeChange(index, e.target.value)}>
                      <option value="">Select Grade</option>
                      {grades.map(g => (
                        <option key={g.id} value={g.id}>{g.nameEn} ({g.nameLocal})</option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Qty (Pcs)</label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Rate/1000</label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={e => handleItemChange(index, 'rate', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Amount</label>
                      <div className="h-11 flex items-center px-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold truncate">
                        {Math.round(item.amount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
             </Card>
           ))}
         </div>

         {/* Payment */}
         <Card className="bg-slate-50 dark:bg-slate-800/50 border-dashed">
           <CardContent className="p-4 space-y-4">
             <div className="flex justify-between items-center text-lg font-bold">
               <span>Total Bill</span>
               <span>Rs. {Math.round(totalAmount).toLocaleString()}</span>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium">Payment Type</label>
               <div className="grid grid-cols-3 gap-2">
                 {['credit', 'cash', 'partial'].map(type => (
                   <Button
                     key={type}
                     type="button"
                     variant={paymentType === type ? 'default' : 'outline'}
                     onClick={() => setPaymentType(type)}
                     className="capitalize"
                     size="sm"
                   >
                     {type}
                   </Button>
                 ))}
               </div>
             </div>

             {paymentType !== 'credit' && (
               <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                 <label className="text-sm font-medium">Amount Received</label>
                 <Input
                   type="number"
                   value={amountReceived}
                   onChange={e => setAmountReceived(e.target.value)}
                   placeholder="Enter amount"
                 />
               </div>
             )}
           </CardContent>
         </Card>

         <Button className="w-full h-14 text-lg shadow-xl shadow-primary/20" onClick={handleSubmit} disabled={loading}>
           {loading ? 'Saving...' : 'Save Dispatch / محفوظ کریں'}
         </Button>
       </div>
     </div>
  )
}
