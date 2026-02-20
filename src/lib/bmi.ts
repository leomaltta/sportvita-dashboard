/** 
 * Functions for calculating and analyzing Body Mass Index (BMI)
 */

import { StudentWithBMI, BMIStats } from '@/types'

/**
 * Calculates BMI from weight and height
 * 
 * Formula: BMI = weight(kg) / (height(m))²
 * 
 * @param weight - Weight in kilograms
 * @param height - Height in meters
 * @returns BMI value rounded to 2 decimal places
 * 
 */
export function calculateBMI(weight: number, height: number): number {
  if (height === 0) return 0
  const bmi = weight / (height * height)
  return Number(bmi.toFixed(2))
}

/**
 * Adds BMI to student data
 * 
 * @param student - Student object with weight and height
 * @returns Student object with calculated BMI
 * 
 */
export function addBMIToStudent(student: {
  weight: number
  height: number
  [key: string]: any
}): StudentWithBMI {
  return {
    ...student,
    imc: calculateBMI(student.weight, student.height),
  } as StudentWithBMI
}


/**
 * Calculates average BMI for a subcategory
 * 
 * @param students - Array of students with BMI
 * @param subCategory - Age group
 * @returns Object with average BMI and count
 * 
 */
export function calculateSubCategoryAverage(
  students: StudentWithBMI[],
  subCategory: string,
): BMIStats {
  const filtered = students.filter((s) => s.subCategory === subCategory)


  if (filtered.length === 0) {
    return { media: 0, count: 0 }
  }

  const sum = filtered.reduce((acc, s) => acc + s.imc, 0)
  const average = sum / filtered.length

  return {
    media: Number(average.toFixed(2)),
    count: filtered.length,
  }
}

/**
 * Calculates sport-wide BMI statistics
 * 
 * @param students - Array of students with BMI
 * @param sportName - Sport name to filter by
 * @returns Overall statistics including highlight subcategory
 * 
 */
export function calculateSportStats(
  students: StudentWithBMI[],
  sportName: string,
): { media: number; count: number; subDestaque: string } {
  const sportStudents = students.filter((s) => s.sportName === sportName)

  if (sportStudents.length === 0) {
    return { media: 0, count: 0, subDestaque: '' }
  }

  // Get unique subcategories
  const subCategories = Array.from(new Set(sportStudents.map((s) => s.subCategory)))

  // Calculate average for each subcategory
  const subStats = subCategories.map((sub) => ({
    sub,
    ...calculateSubCategoryAverage(sportStudents, sub),
  }))

  // Ideal BMI values by age group
  const idealBMI: Record<string, number> = {
    'Sub-6': 14.68,
    'Sub-8': 16.18,
    'Sub-10': 17.78,
    'Sub-12': 19.16,
    'Sub-14': 20.19,
    'Sub-17': 20.96,
  }

  // Find subcategory closest to ideal BMI
  let closestSub = ''
  let minDifference = Infinity

  subStats.forEach(({ sub, media }) => {
    const ideal = idealBMI[sub] || 0
    const difference = Math.abs(media - ideal)

    if (difference < minDifference) {
      minDifference = difference
      closestSub = sub
    }
  })

  // Calculate overall average
  const totalSum = sportStudents.reduce((acc, s) => acc + s.imc, 0)
  const overallAverage = totalSum / sportStudents.length

  return {
    media: Number(overallAverage.toFixed(2)),
    count: sportStudents.length,
    subDestaque: closestSub,
  }
}

/**
 * Classifies BMI status
 * 
 * @param bmi - BMI value
 * @param age - Student age
 * @returns Classification string
 */

export function classifyBMI(bmi: number, age: number): string {
  // Simplified classification for children/adolescents
  if (age < 18) {
    if (bmi < 14) return 'Abaixo do peso'
    if (bmi < 23) return 'Normal'
    if (bmi < 27) return 'Sobrepeso'
    return 'Obesidade'
  }

  // Adult classification
  if (bmi < 18.5) return 'Abaixo do peso'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidade'
}

/**
 * Gets BMI status color
 * 
 * @param classification - BMI classification
 * @returns Tailwind color class
 * 
 */
export function getBMIColor(classification: string): string {
  switch (classification) {
    case 'Normal':
      return 'text-green-600 dark:text-green-400'
    case 'Abaixo do peso':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'Sobrepeso':
      return 'text-orange-600 dark:text-orange-400'
    case 'Obesidade':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}