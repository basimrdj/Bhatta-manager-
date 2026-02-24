'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, Package } from 'lucide-react'

export default function StockPage() {
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({ gradeId: '', quantity: '', type: 'production', notes: '' })

  const fetchStock = () => {
    fetch('/api/stock')
      .then(res => res.json())
      .then(d => {
        setGrades(d)
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }

  useEffect(() => {
    fetchStock()
  }, [])

  const handleSubmit = async () => {
    if (!formData.gradeId || !formData.quantity) return

    await fetch('/api/stock', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    setShowAdd(false)
    setFormData({ gradeId: '', quantity: '', type: 'production', notes: '' })
    fetchStock()
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header title="Stock / اسٹاک" actions={
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      } />

      {showAdd && (
        <div className="p-4 pb-0">
          <Card className="animate-in slide-in-from-top-4 border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-bold text-primary">Add Stock / پیداوار شامل کریں</h3>
              <Select
                value={formData.gradeId}
                onChange={e => setFormData({...formData, gradeId: e.target.value})}
              >
                <option value="">Select Grade</option>
                {grades.map(g => <option key={g.id} value={g.id}>{g.nameEn} ({g.nameLocal})</option>)}
              </Select>

              <Input
                placeholder="Quantity"
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />

              <Select
                 value={formData.type}
                 onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="production">Production (Add)</option>
                <option value="return">Return (Add)</option>
                <option value="wastage">Wastage (Remove)</option>
                <option value="adjustment">Manual Adjustment</option>
              </Select>

              <Input
                placeholder="Notes (Optional)"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button onClick={handleSubmit} className="flex-1">Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-4 grid gap-3">
        {loading ? (
           <div className="text-center py-10">Loading...</div>
        ) : (
          grades.map(g => (
            <Card key={g.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-primary flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{g.nameEn}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{g.nameLocal}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{g.currentStock?.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Available</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
