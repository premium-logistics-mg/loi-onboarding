'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMechanics } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, ChevronRight } from 'lucide-react';

export default function MechanicLoginPage() {
  const router = useRouter();
  const mechanics = getMechanics();
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);

  const handleLogin = () => {
    if (selectedMechanic) {
      router.push(`/mechanic/${selectedMechanic}/jobs`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">LOI Mechanics</h1>
          <p className="text-muted-foreground mt-1">Premium Logistics Maintenance</p>
        </div>

        {/* Mechanic Selection */}
        <Card className="w-full bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Select Your Profile</CardTitle>
            <CardDescription>Tap your name to sign in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mechanics.map((mechanic) => (
              <button
                key={mechanic.id}
                onClick={() => setSelectedMechanic(mechanic.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between touch-target-lg ${
                  selectedMechanic === mechanic.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/50 hover:border-muted-foreground'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold text-foreground">{mechanic.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mechanic.badge} - {mechanic.specialization}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-colors ${
                    selectedMechanic === mechanic.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!selectedMechanic}
          className="w-full mt-6 h-14 text-lg font-semibold touch-target-lg"
          size="lg"
        >
          Sign In
        </Button>

        {/* Manager Link */}
        <button
          onClick={() => router.push('/cockpit')}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Maintenance Manager Cockpit
        </button>
      </div>
    </div>
  );
}
