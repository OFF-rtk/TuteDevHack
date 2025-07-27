"use client"

import type React from "react"
import { useState } from "react"
import { useAppStore } from "@/stores/appStores"
import { Button } from "./Button"
import { Input } from "./Input"
import { formatCurrency } from "../../lib/utils"

export function QuantityModal() {
  const { 
    quantityModal, 
    closeQuantityModal, 
    placeClickOrder, 
    currentUser, 
    openAlertModal,
    isLoading 
  } = useAppStore()
  
  const [quantity, setQuantity] = useState(1)

  if (!quantityModal.isOpen || !quantityModal.groupBuy) return null

  const { groupBuy } = quantityModal
  const totalAmount = quantity * groupBuy.price_per_unit
  const maxQuantity = groupBuy.target_quantity - groupBuy.current_quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      openAlertModal("Authentication Required", "Please log in to place an order")
      return
    }

    if (quantity > maxQuantity) {
      openAlertModal(
        "Invalid Quantity", 
        `Maximum available quantity is ${maxQuantity} units`
      )
      return
    }

    if (quantity <= 0) {
      openAlertModal("Invalid Quantity", "Quantity must be greater than 0")
      return
    }

    try {
      // Use the actual API call from your store
      await placeClickOrder({
        group_buy_id: groupBuy.id,
        quantity: quantity
      })

      // Close modal and reset quantity
      closeQuantityModal()
      setQuantity(1)
      
      // Show success message
      openAlertModal(
        "Order Placed Successfully", 
        `Your order for ${quantity} units has been placed!`
      )
    } catch (error) {
      // Error is already handled in the store, but we can show additional feedback
      openAlertModal(
        "Order Failed", 
        "Failed to place order. Please try again."
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-bounce-in">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Place Order</h3>

        <div className="mb-4">
          <h4 className="font-medium text-[#1F2937]">{groupBuy.products.name}</h4>
          <p className="text-sm text-gray-600">
            Price: {formatCurrency(groupBuy.price_per_unit)} per unit
          </p>
          <p className="text-sm text-gray-600">
            Available: {maxQuantity} units
          </p>
          <p className="text-sm text-gray-600">
            Ends: {new Date(groupBuy.end_date).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Quantity (units)"
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            required
          />

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-semibold text-[#1F2937]">
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={closeQuantityModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
              disabled={isLoading || maxQuantity <= 0}
            >
              {maxQuantity <= 0 ? 'Sold Out' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
