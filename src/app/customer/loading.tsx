import { AVMLoader } from "@/components/ui/AVMLoader"

export default function CustomerLoading() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-white">
      <AVMLoader size="md" />
    </div>
  )
}
