"use client"
import { useAppStore } from "@/stores/appStores"
import { Button } from "./Button"

export function ConfirmModal() {
  const { confirmModal, closeConfirmModal } = useAppStore()

  if (!confirmModal.isOpen) return null

  const handleConfirm = () => {
    confirmModal.onConfirm()
    closeConfirmModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-bounce-in">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{confirmModal.title}</h3>
        <p className="text-gray-600 mb-4">{confirmModal.message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}
