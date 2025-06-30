'use client';
import { useState, useEffect, useMemo } from "react";
import * as Progress from "@radix-ui/react-progress";
import { useTimeBeforeNextDistribution, useGetDistributionPeriod } from "@/app/context/ContractContext/hooks";

export function DistributionProgressBar() {
  const { data: timeBeforeNextDistribution } = useTimeBeforeNextDistribution(); // in seconds counts down to 0
  const { data: distributionPeriod } = useGetDistributionPeriod(); // in seconds

  // Calculate time breakdown
  const timeBreakdown = useMemo(() => {
    if (!timeBeforeNextDistribution) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0
      };
    }

    const totalSeconds = Number(timeBeforeNextDistribution);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds
    };
  }, [timeBeforeNextDistribution]);

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (!distributionPeriod || timeBeforeNextDistribution === undefined) {
      return 0;
    }

    const periodSeconds = Number(distributionPeriod);
    const remainingSeconds = Number(timeBeforeNextDistribution);

    // When remainingSeconds is 0, we're at 100% (distribution ready)
    // When remainingSeconds equals periodSeconds, we're at 0% (just started)
    // Progress = ((period - remaining) / period) * 100
    const elapsed = periodSeconds - remainingSeconds;
    const progressPercentage = (elapsed / periodSeconds) * 100;

    // Ensure progress is between 0 and 100
    return Math.max(0, Math.min(100, progressPercentage));
  }, [distributionPeriod, timeBeforeNextDistribution]);

  // Format the time display
  const timeDisplay = useMemo(() => {
    const { days, hours, minutes, seconds } = timeBreakdown;

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, [timeBreakdown]);

  // Show loading state if data hasn't loaded
  if (timeBeforeNextDistribution === undefined || distributionPeriod === undefined) {
    return (
      <div className="w-full flex flex-col gap-4">
        <h2 className="font-extrabold text-2xl text-theme-grey-6">Loading distribution data...</h2>
        <div className="w-full p-1 bg-theme-grey-7">
          <Progress.Root className="relative overflow-hidden bg-theme-grey-2 rounded-full w-full h-5">
            <Progress.Indicator 
              className="bg-theme-grey-4 w-full h-full animate-pulse"
            />
          </Progress.Root>
        </div>
      </div>
    );
  }

  // Special case: Distribution is ready
  const isDistributionReady = Number(timeBeforeNextDistribution) === 0;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-baseline">
        <h2 className="font-extrabold text-2xl text-theme-grey-6">
          {isDistributionReady ? "Distribution Ready!" : `Distributing in ${timeDisplay}`}
        </h2>
      </div>
      
      <div className="w-full p-1 bg-theme-grey-7">
        <Progress.Root 
          className="relative overflow-hidden bg-theme-grey-2 w-full h-5" 
          value={progress}
        >
          <Progress.Indicator
            className={'h-full transition-transform duration-300 ease-out bg-theme-black'}
            style={{ 
              width: `${progress}%`,
              transform: `translateX(0)` // Remove the translate since we're using width
            }}
          />
        </Progress.Root>
      </div>
      
      {/* Optional: Add detailed time breakdown */}
      {!isDistributionReady && (
        <div className="flex gap-4 text-sm text-theme-grey-5">
          {timeBreakdown.days > 0 && (
            <span>{timeBreakdown.days} days</span>
          )}
          {(timeBreakdown.hours > 0 || timeBreakdown.days > 0) && (
            <span>{timeBreakdown.hours} hours</span>
          )}
          {(timeBreakdown.minutes > 0 || timeBreakdown.hours > 0 || timeBreakdown.days > 0) && (
            <span>{timeBreakdown.minutes} minutes</span>
          )}
          <span>{timeBreakdown.seconds} seconds</span>
        </div>
      )}
    </div>
  );
}