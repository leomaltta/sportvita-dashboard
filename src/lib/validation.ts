export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  export function isInstitutionalEmail(email: string): boolean {
    return email.toLowerCase().endsWith('@sebsa.com.br')
  }
  export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || cleaned.length === 11
  }
  export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
  
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
  
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
  
    return phone
  }
  export function isValidAge(
    age: number,
    min: number = 5,
    max: number = 18,
  ): boolean {
    return age >= min && age <= max
  }
  export function isValidWeight(weight: number): boolean {
    return weight > 0 && weight < 200
  }
  export function isValidHeight(height: number): boolean {
    return height > 0 && height < 3
  }
  export function sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ')
  }