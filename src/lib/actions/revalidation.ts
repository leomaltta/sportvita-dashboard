'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateStudents() {
  revalidateTag('students')
  revalidatePath('/estudantes')
  revalidatePath('/dashboard/[slug]', 'page')
}


export async function revalidateTeachers() {
  revalidateTag('teachers')
  revalidatePath('/professores')
}


export async function revalidateDashboard(sport?: string) {
  if (sport) {
    revalidatePath(`/dashboard/${sport}`)
  } else {
    revalidatePath('/dashboard')
  }
}


export async function revalidateAll() {
  revalidatePath('/', 'layout')
}