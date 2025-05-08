// Create this file: components/dashboard/ContractTemplates.tsx
"use client"
import Link from "next/link"
import { FileText, Users, Building, Globe } from "lucide-react"

export default function ContractTemplates() {
  const templates = [
    {
      id: "freelance",
      title: "Freelance Agreement",
      icon: <FileText className="h-6 w-6 text-primary" />,
      description: "For client-contractor work with milestone payments",
    },
    {
      id: "partnership",
      title: "Business Partnership",
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "For joint ventures with profit sharing agreements",
    },
    {
      id: "supply",
      title: "Supply Chain Contract",
      icon: <Building className="h-6 w-6 text-primary" />,
      description: "For multi-party logistics and manufacturing agreements",
    },
    {
      id: "cross-chain",
      title: "Cross-Chain Agreement",
      icon: <Globe className="h-6 w-6 text-primary" />,
      description: "For agreements spanning multiple parachains",
    }
  ]

  return (
    <div className="mt-8">
      <h2 className="heading-3 mb-4">Contract Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map(template => (
          <Link key={template.id} href={`/create?template=${template.id}`} className="card card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {template.icon}
              </div>
              <h3 className="font-medium">{template.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}