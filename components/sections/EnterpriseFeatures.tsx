"use client"
import Link from "next/link"
import { useState , type ReactNode} from "react"
import { Shield, Clock, Users, FileText, Lock, BarChart3, Globe, Check, ArrowRight, Zap, Server, Wallet } from "lucide-react"

// Define the feature structure type
interface FeatureContent {
  icon: ReactNode;
  title: string;
  description: string;
  details: string[];
  image: string;
}

// Define the features object type
interface FeaturesType {
  [key: string]: FeatureContent;
}

export default function EnterpriseFeatures() {
  const [activeFeature, setActiveFeature] = useState<string>("security")
  
  const features: FeaturesType = {
    security: {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Enterprise-Grade Security",
      description: "SafeStakes prioritizes the security of your business-critical agreements through advanced cryptographic techniques and audited smart contracts.",
      details: [
        "Fully audited smart contract code by leading security firms",
        "Multi-signature verification for high-value transactions",
        "Optional hardware wallet integration for enhanced security",
        "Comprehensive access control with granular permission settings"
      ],
      image: "/placeholder.svg"
    },
    multichain: {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Cross-Chain Compatibility",
      description: "Leverage Polkadot's interoperability to create agreements that work seamlessly across different parachains and blockchains.",
      details: [
        "Support for tokens from any Polkadot parachain",
        "Cross-chain verification of agreement conditions",
        "Interoperable with other major blockchain networks",
        "Multi-asset staking in a single agreement"
      ],
      image: "/placeholder.svg"
    },
    compliance: {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: "Regulatory Compliance",
      description: "Meet industry-specific regulatory requirements with customizable compliance features built into your digital agreements.",
      details: [
        "Audit trails for all contract actions and approvals",
        "Configurable compliance checkpoints for regulated industries",
        "Data retention policies that meet legal requirements",
        "Export functionality for regulatory reporting"
      ],
      image: "/placeholder.svg"
    },
    analytics: {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Advanced Analytics",
      description: "Gain valuable insights from your agreements with comprehensive reporting and analytics dashboards.",
      details: [
        "Real-time monitoring of agreement status and progress",
        "Performance metrics for completion rates and timelines",
        "Customizable reports for stakeholder presentations",
        "Historical data analysis to optimize future agreements"
      ],
      image: "/placeholder.svg"
    },
    integration: {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: "Enterprise Integration",
      description: "Seamlessly connect SafeStakes with your existing business systems through our comprehensive API.",
      details: [
        "REST API for integration with CRM and ERP systems",
        "Webhook support for real-time event notifications",
        "SSO integration with major identity providers",
        "Custom integration services available for enterprise clients"
      ],
      image: "/placeholder.svg"
    },
    scalability: {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Enterprise Scalability",
      description: "Handle thousands of agreements with optimal performance and reliability for organizations of any size.",
      details: [
        "High-throughput transaction processing",
        "Dedicated infrastructure for enterprise clients",
        "Automatic scaling to handle peak loads",
        "Geo-distributed architecture for global operations"
      ],
      image: "/placeholder.svg"
    }
  }

  return (
    <div className="container-custom py-24">
      <div className="mb-16 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          <span>Enterprise Ready</span>
        </div>
        <h2 className="heading-1 mb-4">Designed for Business-Critical Applications</h2>
        <p className="text-xl text-muted-foreground">
          SafeStakes provides the enterprise features needed to implement secure, scalable digital contract solutions across your organization.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/3">
          <div className="space-y-2">
            {Object.keys(features).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFeature(key)}
                className={`flex items-start gap-4 w-full p-4 text-left rounded-lg transition-colors ${
                  activeFeature === key ? "bg-primary/10" : "hover:bg-primary/5"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  activeFeature === key ? "bg-primary/20" : "bg-secondary"
                }`}>
                  {features[key].icon}
                </div>
                <div>
                  <h3 className={`font-medium ${
                    activeFeature === key ? "text-primary" : ""
                  }`}>
                    {features[key].title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {features[key].description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:w-2/3">
          <div className="card p-8 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                {features[activeFeature].icon}
              </div>
              <h3 className="heading-2">{features[activeFeature].title}</h3>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              {features[activeFeature].description}
            </p>

            <div className="mb-8 space-y-4">
              {features[activeFeature].details.map((detail: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20 mt-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
            
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
              <span>Explore {features[activeFeature].title}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Enterprise Plans */}
      <div className="mt-24">
        <div className="mb-16 max-w-3xl mx-auto text-center">
          <h2 className="heading-2 mb-4">Enterprise Plans</h2>
          <p className="text-lg text-muted-foreground">
            Choose the right plan for your organization's unique needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8">
            <div className="mb-6">
              <h3 className="heading-3 mb-2">Business</h3>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">$299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                For small to medium businesses
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Up to 25 concurrent agreements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Basic analytics dashboard</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Email support</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Standard contract templates</p>
              </div>
            </div>
            
            <button className="btn-outline w-full">
              Get Started
            </button>
          </div>
          
          <div className="card p-8 border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            
            <div className="mb-6">
              <h3 className="heading-3 mb-2">Professional</h3>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">$799</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                For growing organizations
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Up to 100 concurrent agreements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Advanced analytics with export</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Priority support with 24-hour response</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Custom contract templates</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">API access</p>
              </div>
            </div>
            
            <button className="btn-primary w-full">
              Get Started
            </button>
          </div>
          
          <div className="card p-8">
            <div className="mb-6">
              <h3 className="heading-3 mb-2">Enterprise</h3>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">Custom</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                For large organizations
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Unlimited agreements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Full-featured analytics suite</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Dedicated account manager</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Single sign-on (SSO) integration</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">Dedicated infrastructure</p>
              </div>
            </div>
            
            <button className="btn-outline w-full">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="mt-24">
        <div className="card bg-gradient-to-br from-primary/5 to-background p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h3 className="heading-3 mb-4">Trusted by Industry Leaders</h3>
              <p className="text-muted-foreground mb-6">
                See how enterprises are transforming their business operations with SafeStakes's smart contract platform.
              </p>
              <Link href="/dashboard" className="btn-primary">
                Read Case Studies
              </Link>
            </div>
            
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-card">
                  <p className="italic text-muted-foreground mb-4">
                    "SafeStakes has revolutionized how we manage our supplier agreements, reducing disputes by 78% and accelerating payment processing times."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary"></div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Supply Chain Director, Global Manufacturing Inc.</p>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-card">
                  <p className="italic text-muted-foreground mb-4">
                    "The cross-chain capabilities enable us to create complex agreements with partners across different blockchain ecosystems, something that was impossible before."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary"></div>
                    <div>
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">CTO, FinTech Innovations Ltd</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Integration CTA */}
      <div className="mt-16 text-center">
        <h3 className="heading-3 mb-4">Ready to Transform Your Business?</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Schedule a demo with our team to see how SafeStakes can streamline your business agreements
          and bring blockchain-powered accountability to your organization.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>Schedule Demo</span>
          </button>
          <Link href="/dashboard" className="btn-outline">
            Explore Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}