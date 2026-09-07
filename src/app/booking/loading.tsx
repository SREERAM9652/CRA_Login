import { AVMLoader } from "@/components/ui/AVMLoader"

export default function BookingLoading() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-[#f8f9fd] p-8">
      <AVMLoader size="md" />
    </div>
  )
}
