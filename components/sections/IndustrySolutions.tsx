"use client"
import { useState , type ReactNode } from "react"
import Link from "next/link"
import { Globe, Building, ArrowRight, Briefcase, GraduationCap, HeartPulse, Landmark, ShieldCheck, Ship } from "lucide-react"

// Define types for our industry data structure
interface UseCase {
  title: string;
  description: string;
  stakeholders: string[];
  implementation: string[];
}

interface IndustryInfo {
  icon: ReactNode;
  title: string;
  description: string;
  benefits: string[];
  useCase: UseCase;
}

interface IndustryDataType {
  [key: string]: IndustryInfo;
}

export default function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState<string>("logistics")
  
  const industryData: IndustryDataType = {
    logistics: {
      icon: <Ship className="h-12 w-12 text-primary" />,
      title: "Logistics & Supply Chain",
      description: "Streamline multi-party supply chain agreements with transparent tracking and automatic fund release based on delivery milestones.",
      benefits: [
        "Real-time tracking of goods through smart contract integration",
        "Automatic payments based on confirmed delivery",
        "Dispute resolution through consensus mechanisms",
        "Reduced intermediaries and associated costs"
      ],
      useCase: {
        title: "International Shipping Agreement",
        description: "A manufacturer, shipping company, and distributor create a three-party agreement with staged payments released as goods move through checkpoints from factory to destination.",
        stakeholders: ["Manufacturer", "Shipping Company", "Distributor"],
        implementation: [
          "Smart contract deployed with GPS integration for location verification",
          "QR code scanning at checkpoints triggers milestone completion",
          "Multiple-signature requirements for final delivery confirmation",
          "Automated penalty calculations for delays with variable rates"
        ]
      }
    },
    legal: {
      icon: <Landmark className="h-12 w-12 text-primary" />,
      title: "Legal Services",
      description: "Transform traditional legal agreements into smart contracts with automated enforcement and reduced administrative overhead.",
      benefits: [
        "Automatic execution of contract terms upon condition fulfillment",
        "Immutable record of agreement terms and amendments",
        "Reduced time-to-execution with digital signatures",
        "Lower legal administration costs"
      ],
      useCase: {
        title: "Digital Services Agreement",
        description: "A law firm creates standardized client contracts with milestone-based billing and automatic payment release upon work completion.",
        stakeholders: ["Law Firm", "Client"],
        implementation: [
          "Document template with customizable variables for client specifics",
          "Milestone system with client approval mechanisms",
          "Time-tracking integration for hourly billing components",
          "Confidentiality provisions with blockchain verification"
        ]
      }
    },
    healthcare: {
      icon: <HeartPulse className="h-12 w-12 text-primary" />,
      title: "Healthcare",
      description: "Secure agreements between providers, insurers, and patients with enhanced privacy and compliance with regulatory standards.",
      benefits: [
        "HIPAA-compliant data sharing protocols",
        "Transparent billing and claim processes",
        "Patient-controlled access to medical information",
        "Automated insurance verification and processing"
      ],
      useCase: {
        title: "Research Collaboration Agreement",
        description: "Multiple healthcare institutions partner on medical research with defined data sharing permissions, funding milestones, and intellectual property provisions.",
        stakeholders: ["Research Hospital", "University", "Pharmaceutical Company", "Grant Provider"],
        implementation: [
          "Privacy-preserving data exchange protocols",
          "Milestone-based research funding releases",
          "Automatic royalty distribution for commercialized discoveries",
          "Regulatory compliance tracking and reporting"
        ]
      }
    },
    education: {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: "Education",
      description: "Create transparent agreements between educational institutions, students, and funding organizations with performance-based incentives.",
      benefits: [
        "Merit-based scholarship distribution systems",
        "Transparent credential verification",
        "Automated tuition refund processing",
        "Performance-linked educational program funding"
      ],
      useCase: {
        title: "Performance-Based Education Funding",
        description: "A scholarship foundation creates agreements with students where funding is released in stages based on academic performance milestones.",
        stakeholders: ["Student", "University", "Scholarship Foundation"],
        implementation: [
          "Automated grade retrieval through university API integration",
          "Stage-based fund disbursement tied to GPA thresholds",
          "Additional bonus payments for exceptional performance",
          "Partial refund mechanisms for discontinued studies"
        ]
      }
    },
    insurance: {
      icon: <ShieldCheck className="h-12 w-12 text-primary" />,
      title: "Insurance",
      description: "Revolutionize policy management and claims processing with transparent, automated smart contract agreements.",
      benefits: [
        "Instant claims processing with verified conditions",
        "Transparent premium calculations",
        "Fraud reduction through immutable verification",
        "Parametric insurance with automatic triggers"
      ],
      useCase: {
        title: "Parametric Crop Insurance",
        description: "Farmers purchase insurance policies that automatically pay out based on verified weather conditions rather than assessed damages.",
        stakeholders: ["Farmer", "Insurance Provider", "Data Oracle"],
        implementation: [
          "Weather data integration from trusted oracle sources",
          "Automatic payment triggers based on predefined conditions",
          "Partial payments for varying degrees of adverse conditions",
          "Transparent premium calculations based on historical data"
        ]
      }
    },
    corporate: {
      icon: <Briefcase className="h-12 w-12 text-primary" />,
      title: "Corporate Governance",
      description: "Enhance shareholder agreements, board decisions, and corporate compliance with transparent, enforceable smart contracts.",
      benefits: [
        "Automated dividend distribution",
        "Transparent voting and governance systems",
        "Regulatory compliance tracking",
        "Streamlined merger and acquisition processes"
      ],
      useCase: {
        title: "Decentralized Voting System",
        description: "A corporation implements a shareholder voting system with automatic execution of approved proposals based on predefined thresholds.",
        stakeholders: ["Board Members", "Shareholders", "Executives"],
        implementation: [
          "Secure voting mechanism with token-weighted representation",
          "Automatic proposal execution when approval thresholds are met",
          "Transparent record of all votes and decisions",
          "Time-locked execution of approved changes"
        ]
      }
    }
  }

  return (
    <div className="container-custom py-24">
      <div className="mb-16 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground mb-4">
          <span>Industry Applications</span>
        </div>
        <h2 className="heading-1 mb-4">Transforming Industries Through Smart Agreements</h2>
        <p className="text-xl text-muted-foreground">
          SafeStakes's cross-chain accountability platform provides tailored solutions for specific industry challenges.
        </p>
      </div>

      {/* Industry Tabs */}
      <div className="border-b mb-12">
        <div className="flex flex-wrap -mb-px">
          {Object.keys(industryData).map((industry) => (
            <button
              key={industry}
              className={`inline-flex items-center px-6 py-4 border-b-2 text-sm font-medium ${
                activeTab === industry
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
              onClick={() => setActiveTab(industry)}
            >
              {industryData[industry].title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Industry Content */}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
              {industryData[activeTab].icon}
            </div>
            <h3 className="heading-2">{industryData[activeTab].title}</h3>
          </div>
          
          <p className="text-lg text-muted-foreground mb-6">
            {industryData[activeTab].description}
          </p>
          
          <div className="mb-10">
            <h4 className="heading-4 mb-4">Key Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industryData[activeTab].benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Link href="/create" className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto">
            <span>Create {industryData[activeTab].title} Contract</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="md:w-1/2">
          <div className="card bg-gradient-to-br from-primary/5 to-background p-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="heading-3">{industryData[activeTab].useCase.title}</h4>
              <div className="badge badge-primary">Case Study</div>
            </div>
            
            <p className="text-muted-foreground mb-6">
              {industryData[activeTab].useCase.description}
            </p>
            
            <div className="mb-6">
              <h5 className="text-sm font-medium uppercase text-muted-foreground mb-3">Stakeholders</h5>
              <div className="flex flex-wrap gap-2">
                {industryData[activeTab].useCase.stakeholders.map((stakeholder: string, index: number) => (
                  <div key={index} className="badge badge-secondary">{stakeholder}</div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium uppercase text-muted-foreground mb-3">Implementation</h5>
              <div className="space-y-3">
                {industryData[activeTab].useCase.implementation.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cross-Chain Benefits */}
      <div className="mt-24">
        <div className="flex flex-col md:flex-row items-center gap-12 border-t border-b py-16">
          <div className="md:w-1/2">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10 mb-6">
              <Globe className="h-12 w-12 text-primary" />
            </div>
            <h3 className="heading-2 mb-4">Cross-Chain Advantages</h3>
            <p className="text-lg text-muted-foreground mb-8">
              SafeStakes leverages Polkadot's cross-consensus messaging (XCM) protocol to enable unprecedented 
              interoperability across parachains, providing unique advantages for multi-party agreements.
            </p>
            <Link href="/dashboard" className="btn-outline flex items-center gap-2 w-fit">
              <span>Explore Cross-Chain Features</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-medium mb-2">Multi-Asset Staking</h4>
                <p className="text-sm text-muted-foreground">
                  Stake different tokens from various parachains in a single agreement
                </p>
              </div>
              
              <div className="card">
                <h4 className="font-medium mb-2">Cross-Chain Data</h4>
                <p className="text-sm text-muted-foreground">
                  Verify conditions using data from multiple blockchain networks
                </p>
              </div>
              
              <div className="card">
                <h4 className="font-medium mb-2">Universal Compatibility</h4>
                <p className="text-sm text-muted-foreground">
                  Create agreements between entities on different Polkadot parachains
                </p>
              </div>
              
              <div className="card">
                <h4 className="font-medium mb-2">Holistic Security</h4>
                <p className="text-sm text-muted-foreground">
                  Benefit from Polkadot's shared security model across all agreements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enterprise Integration */}
      <div className="mt-24 text-center">
        <h3 className="heading-3 mb-6">Ready to Integrate With Your Industry?</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Our team can help customize SafeStakes to meet your specific industry requirements
          with tailored solutions and enterprise-grade support.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/create" className="btn-primary">
            Start Free Trial
          </Link>
          <Link href="/dashboard" className="btn-outline">
            Request Demo
          </Link>
        </div>
      </div>
    </div>
  )
}