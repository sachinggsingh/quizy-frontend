"use client"

import { LoaderThree, LoaderFive } from "@/components/ui/loader"

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-center scale-150">
          <LoaderThree />
        </div>
        
        <div className="flex flex-col items-center">
            <div className="text-2xl">
              <LoaderFive text="QuizMaster" />
            </div>
        </div>
      </div>
    </div>
  )
}
