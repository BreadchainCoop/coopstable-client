'use client';
import { useState, useEffect } from "react";
import { Progress } from "radix-ui";

export function DistributionProgressBar() {
    const distributionData: {
        daysLeft: number;
        periodLength: number;
        currentPeriod: number;
    } = {
        daysLeft: 20,
        periodLength: 10,
        currentPeriod: 1
    }
    const [progress, setProgress] = useState(0);
    useEffect(() => {
		const timer = setTimeout(() => setProgress(33), 500);
		return () => clearTimeout(timer);
	}, []);
    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="font-extrabold text-2xl text-theme-grey-6">Distributing in {distributionData.daysLeft} days</h2> 
            <div className="w-full p-1 bg-theme-grey-7">
                <Progress.Root className="progress-bar root rounded-0" value={progress}>
                    <Progress.Indicator
                        className="progressbase indicator rounded-0 bg-theme-black h-5 w-full"
                        style={{ transform: `translateX(-${100 - progress}%)` }}
                    />
                </Progress.Root>
            </div>
        </div>
    );
}
