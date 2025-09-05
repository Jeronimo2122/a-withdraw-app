// Utilidades de validación
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateAmount = (amount: string): { valid: boolean; error?: string } => {
  const numAmount = parseFloat(amount)
  
  if (!amount || isNaN(numAmount)) {
    return { valid: false, error: 'El monto debe ser un número válido' }
  }
  
  if (numAmount <= 0) {
    return { valid: false, error: 'El monto debe ser mayor a 0' }
  }
  
  if (numAmount > 10000) {
    return { valid: false, error: 'El monto no puede exceder €10,000' }
  }
  
  return { valid: true }
}

export const validatePersonalData = (data: {
  fullName: string
  email: string
  phoneNumber: string
  birthDate: string
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.fullName.trim()) {
    errors.push('El nombre completo es requerido')
  }

  if (!data.email.trim()) {
    errors.push('El correo electrónico es requerido')
  } else if (!validateEmail(data.email)) {
    errors.push('El correo electrónico no es válido')
  }

  if (!data.phoneNumber.trim()) {
    errors.push('El número de celular es requerido')
  } else if (!validatePhoneNumber(data.phoneNumber)) {
    errors.push('El número de celular no es válido')
  }

  if (!data.birthDate.trim()) {
    errors.push('La fecha de nacimiento es requerida')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
