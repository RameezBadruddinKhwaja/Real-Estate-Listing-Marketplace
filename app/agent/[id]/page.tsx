import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import PropertyCard from '@/components/property/PropertyCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Star, MapPin, Building2 } from 'lucide-react'
import Image from 'next/image'

async function getAgent(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agents/${id}`, {
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Agent not found')
    return response.json()
  } catch (error) {
    return null
  }
}

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id)

  if (!agent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Agent Profile */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {agent.avatar_url ? (
                  <Image
                    src={agent.avatar_url}
                    alt={agent.name}
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-4xl text-gray-600">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
                    {agent.agency && (
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Building2 className="w-4 h-4 mr-2" />
                        {agent.agency}
                      </div>
                    )}
                  </div>

                  {agent.verified && (
                    <Badge className="bg-green-500">Verified Agent</Badge>
                  )}
                </div>

                {/* Rating */}
                {agent.rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < agent.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {agent.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-2xl font-bold">{agent.total_properties}</p>
                    <p className="text-sm text-muted-foreground">Properties</p>
                  </div>
                </div>

                {/* Bio */}
                {agent.bio && (
                  <p className="text-muted-foreground mb-4">{agent.bio}</p>
                )}

                {/* Contact */}
                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${agent.phone}`}>
                    <Button variant="default">
                      <Phone className="w-4 h-4 mr-2" />
                      {agent.phone}
                    </Button>
                  </a>
                  <a href={`mailto:${agent.email}`}>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent's Properties */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {agent.name}'s Properties
            {agent.properties && ` (${agent.properties.length})`}
          </h2>

          {agent.properties && agent.properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agent.properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No properties listed yet
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
