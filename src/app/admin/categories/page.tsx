'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Settings2, Trash } from 'lucide-react'

type Category = {
  id: string
  name: string
  description: string
  createdAt: string
}

type Subcategory = {
  id: string
  name: string
  categoryId: string
}

export default function CategoryPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newSubName, setNewSubName] = useState<{ [catId: string]: string }>({})
  const [submittingSub, setSubmittingSub] = useState<{ [catId: string]: boolean }>({})
  const [editingSubId, setEditingSubId] = useState<string | null>(null)
  const [editSubName, setEditSubName] = useState<string>('')

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [showEditSubModal, setShowEditSubModal] = useState(false);
  const [activeCategoryForSub, setActiveCategoryForSub] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
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

  const fetchSubcategories = async () => {
    try {
      const res = await fetch('/api/subcategory')
      const data = await res.json()
      setSubcategories(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load subcategories')
    }
  }

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error('Both name and description are required')
      return
    }

    const tempId = `temp-${Date.now()}`
    const newCategory: Category = {
      id: tempId,
      name,
      description,
      createdAt: new Date().toISOString(),
    }

    setCategories((prev) => [...prev, newCategory])
    setName('')
    setDescription('')
    setShowAddModal(false)
    setLoading(true)

    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.name, description: newCategory.description }),
      })

      if (!res.ok) throw new Error()

      const actualCategory = await res.json()

      setCategories((prev) =>
        prev.map((cat) => (cat.id === tempId ? actualCategory : cat))
      )

      toast.success('Category added')
    } catch (err) {
      console.error(err)
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

  const handleAddSubcategory = async (categoryId: string) => {
    const name = newSubName[categoryId]?.trim()
    if (!name) {
      toast.error("Subcategory name is required")
      return
    }

    setSubmittingSub((prev) => ({ ...prev, [categoryId]: true }))

    try {
      const res = await fetch("/api/subcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, categoryId }),
      })

      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      const created = await res.json()
      setSubcategories((prev) => [...prev, created])
      setNewSubName((prev) => ({ ...prev, [categoryId]: "" }))
      toast.success("Subcategory added")
    } catch (err) {
      toast.error("Failed to add subcategory")
      console.error(err)
    } finally {
      setSubmittingSub((prev) => ({ ...prev, [categoryId]: false }))
    }
  }

  const handleEditSubcategory = (sub: Subcategory) => {
    setEditingSubId(sub.id);
    setEditSubName(sub.name);
  }

  const handleSaveSubcategoryEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/subcategory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editSubName }),
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setSubcategories((prev) => prev.map((sub) => sub.id === id ? updated : sub));
      setEditingSubId(null);
      toast.success('Subcategory updated');
    } catch (err) {
      toast.error('Failed to update subcategory, Error:'+err);
    }
  }

  const handleDeleteSubcategory = async (id: string) => {
    try {
      const res = await fetch(`/api/subcategory/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
      toast.success('Subcategory deleted');
    } catch (err) {
      toast.error('Failed to delete subcategory, Error:'+err);
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold">Manage Categories</h2>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          className="sm:max-w-xs"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setShowAddModal(true)}>Add Category</Button>
      </div>

      {/* Category List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Existing Categories</h3>
        {filteredCategories.length < 1 && <p className="text-gray-600 mt-6">No matching categories found.</p>}
        <div className="space-y-4">
          {filteredCategories.map((cat) => (
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
                <div className='flex flex-col'>
                  <div className='flex w-full justify-between '>
                    <div>
                      <p className="font-semibold text-lg">{cat.name}</p>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                      <div className="mt-2 py-4 ml-2 space-y-2">
                        {subcategories
                          .filter((s) => s.categoryId === cat.id)
                          .map((sub) => (
                            <div key={sub.id} className="flex space-y-2 items-center gap-2 text-sm text-gray-600">
                              {editingSubId === sub.id && showEditSubModal ? (
                                <>
                                  {/* Removed inline edit inputs */}
                                </>
                              ) : (
                                <div className='flex justify-between space-x-10 w-full'>
                                  <div>– {sub.name}</div>
                                  <div className='space-x-2'>
                                  <Button
                                  className='border-[1px] border-gray-200'
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      handleEditSubcategory(sub)
                                      setShowEditSubModal(true)
                                    }}
                                  >
                                    <Settings2/>
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDeleteSubcategory(sub.id)}><Trash/></Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleEdit(cat)}><Settings2/></Button>
                      <Button variant="destructive" onClick={() => handleDelete(cat.id)}><Trash/></Button>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveCategoryForSub(cat.id)
                        setShowAddSubModal(true)
                      }}
                    >
                      Add Subcategory
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleCreate} disabled={loading}>Add Category</Button>
            <Button variant="destructive" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Modal */}
      <Dialog open={showAddSubModal} onOpenChange={setShowAddSubModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
          </DialogHeader>
          <Input
            className="mt-4"
            placeholder="Subcategory name"
            value={newSubName[activeCategoryForSub || ''] || ''}
            onChange={(e) =>
              setNewSubName((prev) => ({
                ...prev,
                [activeCategoryForSub || '']: e.target.value,
              }))
            }
          />
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                if (activeCategoryForSub) handleAddSubcategory(activeCategoryForSub);
                setShowAddSubModal(false);
              }}
              disabled={!activeCategoryForSub || submittingSub[activeCategoryForSub]}
            >
              Add
            </Button>
            <Button variant="ghost" onClick={() => setShowAddSubModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Modal */}
      <Dialog open={showEditSubModal} onOpenChange={setShowEditSubModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <Input
            className="mt-4"
            placeholder="New subcategory name"
            value={editSubName}
            onChange={(e) => setEditSubName(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                if (editingSubId) handleSaveSubcategoryEdit(editingSubId);
                setShowEditSubModal(false);
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={() => setShowEditSubModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}