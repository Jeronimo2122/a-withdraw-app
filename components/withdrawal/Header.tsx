import { X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  onClose?: () => void
}

export default function Header({ title, showBack = false, onBack, onClose }: HeaderProps) {
  return (
    <div className="bg-[#2C2C2E] text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-300">Balance</div>
          <div className="text-lg font-semibold">€ 345,28</div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
