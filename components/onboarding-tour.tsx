'use client';

import { useState, useEffect } from 'react';
import { TourProvider, useTour } from '@reactour/tour';

const TOUR_KEY = 'json-differ-tour-completed';

const tourSteps = [
  {
    selector: '[data-tour="welcome"]',
    content: ({ setCurrentStep, setIsOpen }: any) => (
      <div className="p-2">
        <h3 className="text-lg font-semibold mb-2">Welcome to JSON Differ! 👋</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Let's take a quick 30-second tour to show you the main features.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem(TOUR_KEY, 'true');
              setIsOpen(false);
            }}
            className="px-3 py-1 text-xs border rounded hover:bg-muted"
          >
            Skip Tour
          </button>
          <button
            onClick={() => setCurrentStep(1)}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Start Tour →
          </button>
        </div>
      </div>
    ),
  },
  {
    selector: '[data-tour="load-sample"]',
    content: 'Click here to instantly load sample JSON data and try the tool.',
  },
  {
    selector: '[data-tour="diff-summary"]',
    content: 'See color-coded statistics: added (green), removed (red), and modified (yellow) fields.',
  },
  {
    selector: '[data-tour="options"]',
    content: 'Access diff presets and advanced comparison options here.',
  },
  {
    selector: '[data-tour="show-diff"]',
    content: 'Toggle between split editors and side-by-side diff view.',
  },
  {
    selector: '[data-tour="tabs"]',
    content: 'Explore more features: Convert formats, Validate schemas, and view History.',
  },
];

function TourContent({ children }: { children: React.ReactNode }) {
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_KEY);
    if (!tourCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setCurrentStep(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [setIsOpen, setCurrentStep]);

  return <>{children}</>;
}

export function OnboardingTour({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider
      steps={tourSteps}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: '8px',
          padding: '16px',
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: 'hsl(var(--primary))',
        }),
      }}
      onClickClose={({ setIsOpen }) => {
        localStorage.setItem(TOUR_KEY, 'true');
        setIsOpen(false);
      }}
      onClickMask={({ setIsOpen }) => {
        localStorage.setItem(TOUR_KEY, 'true');
        setIsOpen(false);
      }}
    >
      <TourContent>{children}</TourContent>
    </TourProvider>
  );
}

export function TourResetButton() {
  const handleReset = () => {
    localStorage.removeItem(TOUR_KEY);
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      className="text-xs text-muted-foreground hover:text-foreground underline"
      title="Restart the onboarding tour"
    >
      Restart Tour
    </button>
  );
}
