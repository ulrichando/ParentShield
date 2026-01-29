"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
          <p className="text-gray-400 mb-8">
            {description || "This page is coming soon. We're working hard to bring you this content."}
          </p>
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
