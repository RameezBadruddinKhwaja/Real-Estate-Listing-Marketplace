'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Home, Users } from 'lucide-react'

export default function AdminPanel() {
  const [pendingProperties, setPendingProperties] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingApproval: 0,
    totalAgents: 0,
    featuredListings: 0
  })

  useEffect(() => {
    loadPendingProperties()
    loadStats()
  }, [])

  const loadPendingProperties = async () => {
    // TODO: Implement with actual API
    setPendingProperties([])
  }

  const loadStats = async () => {
    // TODO: Implement with actual API
    setStats({
      totalProperties: 125,
      pendingApproval: 8,
      totalAgents: 24,
      featuredListings: 15
    })
  }

  const handleApprove = async (propertyId: string) => {
    try {
      await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })
      loadPendingProperties()
    } catch (error) {
      console.error('Error approving property:', error)
    }
  }

  const handleReject = async (propertyId: string) => {
    try {
      await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })
      loadPendingProperties()
    } catch (error) {
      console.error('Error rejecting property:', error)
    }
  }

  const handleToggleFeatured = async (propertyId: string, featured: boolean) => {
    try {
      await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured })
      })
      loadPendingProperties()
    } catch (error) {
      console.error('Error toggling featured:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage properties and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Home className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Listings</CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredListings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Property Approvals</CardTitle>
            <CardDescription>
              Review and approve new property listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingProperties.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending properties
              </p>
            ) : (
              <div className="space-y-4">
                {pendingProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.location?.name} • {property.property_type}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(property.id, property.featured)}
                      >
                        <Star className={`h-4 w-4 ${property.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(property.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(property.id)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
