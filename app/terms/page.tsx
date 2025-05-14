"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using FitParent Profile, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use FitParent Profile for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. User Account</h2>
            <p>
              To access certain features of the website, you may be required to register for an account. You agree to provide accurate and complete information when creating your account.
            </p>

            <h2>4. Privacy</h2>
            <p>
              Your use of FitParent Profile is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
            </p>

            <h2>5. Disclaimer</h2>
            <p>
              The materials on FitParent Profile are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>6. Limitations</h2>
            <p>
              In no event shall FitParent Profile or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FitParent Profile.
            </p>

            <h2>7. Revisions and Errata</h2>
            <p>
              The materials appearing on FitParent Profile could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current.
            </p>

            <h2>8. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 