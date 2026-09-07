import { AVMLoader } from "@/components/ui/AVMLoader"

export default function CRADashboardLoading() {
  return (
    <div className="flex-1 min-h-[60vh] w-full flex items-center justify-center p-8">
      <AVMLoader size="md" />
    </div>
  )
}
