"use client"

import { useState, useEffect } from "react"
import { useWithdrawal } from '../hooks/useWithdrawal'
import Header from '../../components/withdrawal/Header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface DataViewProps {
  onNext: () => void
  onBack: () => void
}

export default function DataView({ onNext, onBack }: DataViewProps) {
  const { withdrawalData, updatePersonalData, error, setError } = useWithdrawal()
  const [formData, setFormData] = useState(withdrawalData.personalData)

  useEffect(() => {
    setFormData(withdrawalData.personalData)
  }, [withdrawalData.personalData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    updatePersonalData({ [field]: value })
    setError(null) // Clear error when user types
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.fullName.trim()) {
      errors.push('El nombre completo es requerido')
    }

    if (!formData.email.trim()) {
      errors.push('El correo electrónico es requerido')
    } else if (!isValidEmail(formData.email)) {
      errors.push('El correo electrónico no es válido')
    }

    if (!formData.phoneNumber.trim()) {
      errors.push('El número de celular es requerido')
    }

    if (!formData.birthDate.trim()) {
      errors.push('La fecha de nacimiento es requerida')
    }

    return errors
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleContinue = () => {
    const errors = validateForm()
    
    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }

    onNext()
  }

  const isFormValid = formData.fullName && formData.birthDate && formData.email && formData.phoneNumber

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Datos" showBack onBack={onBack} />
      
      <div className="px-4 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Completa tus datos personales:
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <Input
              type="text"
              placeholder="Introduce tu nombre completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de nacimiento
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="MM/DD/AA"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="Introduce tu correo electrónico"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de celular
            </label>
            <Input
              type="tel"
              placeholder="Introduce tu número de celular"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-full h-14 bg-[#2C2C2E] text-white text-lg font-semibold rounded-2xl hover:bg-[#1C1C1E] disabled:bg-gray-300"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
