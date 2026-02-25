import { StudentWithBMI, BMIStats } from '@/types'
export function calculateBMI(weight: number, height: number): number {
  if (height === 0) return 0
  const bmi = weight / (height * height)
  return Number(bmi.toFixed(2))
}
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

export function calculateSportStats(
  students: StudentWithBMI[],
  sportName: string,
): { media: number; count: number; subDestaque: string } {
  const sportStudents = students.filter((s) => s.sportName === sportName)

  if (sportStudents.length === 0) {
    return { media: 0, count: 0, subDestaque: '' }
  }
  const subCategories = Array.from(new Set(sportStudents.map((s) => s.subCategory)))

  const subStats = subCategories.map((sub) => ({
    sub,
    ...calculateSubCategoryAverage(sportStudents, sub),
  }))

  const idealBMI: Record<string, number> = {
    'Sub-6': 14.68,
    'Sub-8': 16.18,
    'Sub-10': 17.78,
    'Sub-12': 19.16,
    'Sub-14': 20.19,
    'Sub-17': 20.96,
  }

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

  const totalSum = sportStudents.reduce((acc, s) => acc + s.imc, 0)
  const overallAverage = totalSum / sportStudents.length

  return {
    media: Number(overallAverage.toFixed(2)),
    count: sportStudents.length,
    subDestaque: closestSub,
  }
}


export function classifyBMI(bmi: number, age: number): string {
  if (age < 18) {
    if (bmi < 14) return 'Abaixo do peso'
    if (bmi < 23) return 'Saudável'
    if (bmi < 27) return 'Sobrepeso'
    return 'Obesidade'
  }

  if (bmi < 18.5) return 'Abaixo do peso'
  if (bmi < 25) return 'Saudável'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidade'
}


export function getBMIColor(classification: string): string {
  switch (classification) {
    case 'Saudável':
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
