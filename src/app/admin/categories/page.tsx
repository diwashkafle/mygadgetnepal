'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

type Category = {
  id: string
  name: string
  description: string
  createdAt: string
}

export default function CategoryPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.log(err)
      toast.error('Failed to load categories')
    }
  }

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error('Both name and description are required')
      return
    }
  
    const tempId = `temp-${Date.now()}` // temporary ID for UI tracking
    const newCategory: Category = {
      id: tempId,
      name,
      description,
      createdAt: new Date().toISOString(),
    }
  
    // ✅ Optimistically update UI
    setCategories((prev) => [...prev, newCategory])
    setName('')
    setDescription('')
    setLoading(true)
  
    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.name, description: newCategory.description }),
      })
  
      if (!res.ok) throw new Error()
  
      const actualCategory = await res.json()
  
      //  Replace temp category with real one
      setCategories((prev) =>
        prev.map((cat) => (cat.id === tempId ? actualCategory : cat))
      )
  
      toast.success('Category added')
    } catch (err) {
      console.error(err)
  
      //  Remove temp category on error
      setCategories((prev) => prev.filter((cat) => cat.id !== tempId))
      toast.error('Failed to add category')
    } finally {
      setLoading(false)
    }
  }
  

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()

      toast.success('Category deleted')
      fetchCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, description: cat.description })
  }

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) throw new Error()

      toast.success('Category updated')
      setEditingId(null)
      fetchCategories()
    } catch {
      toast.error('Failed to update category')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold">Manage Categories</h2>

      {/* Create Category */}
      <div className="space-y-2">
        <Label>Category Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Laptops" />

        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short category description" />

        <Button className="mt-2" onClick={handleCreate} disabled={loading}>Add Category</Button>
      </div>

      {/* Category List */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Existing Categories</h3>
        {categories.length < 1 && <h1 className='text-gray-700 mt-10'>No categories yet!</h1>}
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="p-4 border rounded space-y-2">
              {editingId === cat.id ? (
                <>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Category name"
                  />
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Category description"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveEdit(cat.id)}>Save</Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold text-lg">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Button className=' cursor-pointer ' variant="outline" onClick={() => handleEdit(cat)}>Edit</Button>
                    <Button className=' cursor-pointer ' variant="destructive" onClick={() => handleDelete(cat.id)}>Delete</Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
