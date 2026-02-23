import { classifyBMI } from './bmi'

describe('classifyBMI', () => {
  it('classifies underweight children correctly', () => {
    expect(classifyBMI(13.9, 12)).toBe('Abaixo do peso')
  })

  it('classifies normal children correctly', () => {
    expect(classifyBMI(18.2, 12)).toBe('Normal')
  })

  it('classifies overweight children correctly', () => {
    expect(classifyBMI(26, 12)).toBe('Sobrepeso')
  })

  it('classifies obesity in children correctly', () => {
    expect(classifyBMI(30, 12)).toBe('Obesidade')
  })

  it('classifies adults using adult thresholds', () => {
    expect(classifyBMI(18.4, 18)).toBe('Abaixo do peso')
    expect(classifyBMI(24.9, 18)).toBe('Normal')
    expect(classifyBMI(29.9, 18)).toBe('Sobrepeso')
    expect(classifyBMI(30, 18)).toBe('Obesidade')
  })
})
