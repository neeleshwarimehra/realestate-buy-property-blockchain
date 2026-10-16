'use client'

import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800/90 backdrop-blur-lg text-white border-gray-700">
        <DialogTitle className="text-2xl font-bold text-center">
          Sign In
        </DialogTitle>
        
        <div className="grid gap-6">
          <div className="space-y-2 text-center">
            <p className="text-gray-400">Choose your preferred sign in method</p>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full bg-white/5 border-gray-700 hover:bg-white/10 text-white space-x-2">
              <GithubIcon className="h-5 w-5" />
              <span>Continue with Github</span>
            </Button>
            <Button variant="outline" className="w-full bg-white/5 border-gray-700 hover:bg-white/10 text-white space-x-2">
              <Mail className="h-5 w-5" />
              <span>Continue with Email</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800/90 px-2 text-gray-400">Or</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                className="bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
            </div>
            <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm">
            <a href="#" className="text-[#3B82F6] hover:text-[#2563EB]">Forgot password?</a>
          </div>

          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-[#3B82F6] hover:text-[#2563EB]">Sign up</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 