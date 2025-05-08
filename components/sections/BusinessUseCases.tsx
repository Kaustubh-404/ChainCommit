"use client"
import Link from "next/link"
import { ChevronRight, FileText, Users, Coins, Clock, ArrowRight, Check, Building, Handshake } from "lucide-react"

export default function BusinessUseCases() {
  const useCases = [
    {
      id: "freelance",
      title: "Freelance & Agency Contracts",
      icon: <FileText className="h-10 w-10 text-primary" />,
      description: "Secure milestone-based payments between clients and service providers with automatic fund release upon work approval.",
      benefits: [
        "No more chasing late payments",
        "Milestone-based partial releases",
        "Dispute prevention through clear terms",
        "Protection for both clients and freelancers",
      ],
      example: {
        title: "Web Design Project Contract",
        parties: "Client & Designer",
        milestones: "4 stages with partial payments",
        timeline: "8 weeks total",
        stakingAmount: "3.2 DOT"
      }
    },
    {
      id: "partnerships",
      title: "Business Partnership Agreements",
      icon: <Handshake className="h-10 w-10 text-primary" />,
      description: "Define clear terms and financial obligations for joint ventures and business partnerships with automated enforcement.",
      benefits: [
        "Clear profit-sharing mechanisms",
        "Automated dividend distribution",
        "Performance-based incentives",
        "Transparent contribution tracking"
      ],
      example: {
        title: "Joint Product Launch Agreement",
        parties: "Two companies",
        milestones: "3 major development phases",
        timeline: "6 months",
        stakingAmount: "15 DOT each"
      }
    },
    {
      id: "supply-chain",
      title: "Supply Chain Commitments",
      icon: <Building className="h-10 w-10 text-primary" />,
      description: "Create binding agreements between suppliers, manufacturers, and distributors with financial incentives for timely delivery.",
      benefits: [
        "Quality assurance verification",
        "On-time delivery incentives",
        "Automated logistics confirmations",
        "Multiple stakeholder coordination"
      ],
      example: {
        title: "Manufacturing & Delivery Contract",
        parties: "Supplier, Manufacturer, Distributor",
        milestones: "5 checkpoints",
        timeline: "3 months production cycle",
        stakingAmount: "8 DOT per party"
      }
    }
  ]

  return (
    <div className="container-custom py-24">
      <div className="mb-16 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          <span>Enterprise Solutions</span>
        </div>
        <h2 className="heading-1 mb-4">Digital Contracts for Real Business Needs</h2>
        <p className="text-xl text-muted-foreground">
          SafeStakes transforms traditional business agreements into secure, automated smart contracts with built-in accountability.
        </p>
      </div>

      <div className="space-y-16">
        {useCases.map((useCase, index) => (
          <div key={useCase.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}>
            <div className="md:w-1/2">
              <div className={`card p-8 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-secondary/30'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    {useCase.icon}
                  </div>
                  <div className="flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium">
                    Use Case #{index + 1}
                  </div>
                </div>
                <h3 className="heading-3 mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium uppercase text-muted-foreground mb-3">Key Benefits</h4>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link 
                  href={`/dashboard`} 
                  className="btn-outline flex w-full items-center justify-center gap-2"
                >
                  <span>View Demo Contract</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="space-y-4">
                <h3 className="heading-4 mb-2">Example: {useCase.example.title}</h3>
                <p className="text-muted-foreground mb-6">
                  See how {useCase.title.toLowerCase()} can be implemented using SafeStakes's secure smart contract platform.
                </p>
                
                <div className="card bg-background">
                  <h4 className="text-lg font-medium mb-4">Contract Details</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span>Parties Involved</span>
                      </div>
                      <span className="font-medium">{useCase.example.parties}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Coins className="h-5 w-5 text-muted-foreground" />
                        <span>Staking Amount</span>
                      </div>
                      <span className="font-medium">{useCase.example.stakingAmount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span>Timeline</span>
                      </div>
                      <span className="font-medium">{useCase.example.timeline}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span>Milestones</span>
                      </div>
                      <span className="font-medium">{useCase.example.milestones}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Link 
                    href="/create" 
                    className="text-primary flex items-center gap-1 font-medium hover:underline"
                  >
                    <span>Create similar contract</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20">
        <div className="card p-8 bg-primary/10 border-2 border-primary/20">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-2/3">
              <h3 className="heading-3 mb-3">Ready to transform your business agreements?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Join hundreds of businesses that are already using SafeStakes to create secure, 
                automated digital contracts with built-in accountability.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/create" className="btn-primary">
                  Create Your First Contract
                </Link>
                <Link href="/dashboard" className="btn-outline">
                  View Demo Dashboard
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-primary mb-2">400+</div>
                <div className="text-lg font-medium">Active Business Contracts</div>
                <div className="text-sm text-muted-foreground">across the Polkadot ecosystem</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}