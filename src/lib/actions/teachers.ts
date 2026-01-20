'use server'

import prisma from '../../../prisma/client'
import { revalidateTeachers } from './revalidation'
import { ApiResponse, TeacherFormData } from '@/types'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants'

export async function createTeacher(
  data: TeacherFormData,
): Promise<ApiResponse> {
  try {
    await prisma.teacher.create({
      data: {
        name: data.name,
        email: data.email,
        registrationCode: data.matricula,
        sportId: data.esporteID,
        subCategory: data.turma,
        shift: data.turno,
      },
    })

    // Revalidate cache
    await revalidateTeachers()

    return {
      success: true,
      message: SUCCESS_MESSAGES.TEACHER_CREATED,
    }
  } catch (error) {
    console.error('Error creating teacher:', error)
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

export async function updateTeacher(
  id: bigint,
  data: TeacherFormData,
): Promise<ApiResponse> {
  try {
    await prisma.teacher.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        registrationCode: data.matricula,
        sportId: data.esporteID,
        subCategory: data.turma,
        shift: data.turno,
      },
    })

    // Revalidate cache
    await revalidateTeachers()

    return {
      success: true,
      message: SUCCESS_MESSAGES.TEACHER_UPDATED,
    }
  } catch (error) {
    console.error('Error updating teacher:', error)
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

export async function deleteTeacher(id: bigint): Promise<ApiResponse> {
  try {
    await prisma.teacher.delete({
      where: { id },
    })

    // Revalidate cache
    await revalidateTeachers()

    return {
      success: true,
      message: SUCCESS_MESSAGES.TEACHER_DELETED,
    }
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

export async function getAllTeachers() {
  try {
    return await prisma.teacher.findMany({
      include: {
        sport: true,
      },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return []
  }
}

export async function getTeacherById(id: bigint) {
  try {
    return await prisma.teacher.findUnique({
      where: { id },
      include: {
        sport: true,
      },
    })
  } catch (error) {
    console.error('Error fetching teacher:', error)
    return null
  }
}

/**
 * Gets teachers by sport
 * 
 * @param sportId - Sport ID to filter by
 * @returns Array of teachers for that sport
 * 
 * @example
 * ```ts
 * const futsalTeachers = await getTeachersBySport(1)
 * ```
 */
export async function getTeachersBySport(sportId: number) {
  try {
    return await prisma.teacher.findMany({
      where: { sportId },
      include: {
        sport: true,
      },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching teachers by sport:', error)
    return []
  }
}