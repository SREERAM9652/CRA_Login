import { AVMLoader } from "@/components/ui/AVMLoader"

export default function RootLoading() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-white p-8">
      <AVMLoader size="lg" />
    </div>
  )
}
