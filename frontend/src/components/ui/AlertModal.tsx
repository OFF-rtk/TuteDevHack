"use client"
import { useAppStore } from "@/stores/appStores"
import { Button } from "./Button"

export function AlertModal() {
  const { alertModal, closeAlertModal } = useAppStore()

  if (!alertModal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-bounce-in">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{alertModal.title}</h3>
        <p className="text-gray-600 mb-4">{alertModal.message}</p>
        <div className="flex justify-end">
          <Button onClick={closeAlertModal}>OK</Button>
        </div>
      </div>
    </div>
  )
}
