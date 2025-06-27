'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import toast from 'react-hot-toast'

type Product = {
  id: string
  name: string
  price: number
  stock: number
  status: string
  images: string[]
  category: {
    name: string
  }
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.log(error);
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold">All Products</h2>

      {loading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4 space-y-2 shadow-sm">
              {product.images[0] && (
                <div className="relative w-full h-48 mb-2 rounded overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">Category: {product.category.name}</p>
                <p className="text-sm">Price: Rs. {product.price}</p>
                <p className="text-sm">Stock: {product.stock}</p>
                <p className="text-xs text-gray-500 italic">{product.status}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" disabled>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
