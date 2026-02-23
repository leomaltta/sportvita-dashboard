'use server'

import bcrypt from 'bcrypt'
import prisma from '../../../prisma/client'
import { revalidateTeachers } from './revalidation'
import { ApiResponse, TeacherFormData } from '@/types'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants'

const DEFAULT_TEACHER_PASSWORD = 'prof@12345'

function resolveTeacherDefaultPassword(): string {
  const password = process.env.TEACHER_DEFAULT_PASSWORD?.trim()

  if (password) {
    return password
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'TEACHER_DEFAULT_PASSWORD is required in production for teacher account provisioning.',
    )
  }

  return DEFAULT_TEACHER_PASSWORD
}

async function getDefaultTeacherPasswordHash() {
  return bcrypt.hash(resolveTeacherDefaultPassword(), 10)
}

async function syncTeacherUser(name: string, email: string): Promise<ApiResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  })

  if (existingUser && existingUser.role !== 'prof') {
    return {
      success: false,
      error: 'Este e-mail já está vinculado a um usuário não professor.',
    }
  }

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: {
        name,
        role: 'prof',
      },
    })

    return { success: true }
  }

  const passwordHash = await getDefaultTeacherPasswordHash()

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: 'prof',
    },
  })

  return { success: true }
}

export async function createTeacher(
  data: TeacherFormData,
): Promise<ApiResponse> {
  try {
    const teacherWithEmail = await prisma.teacher.findFirst({
      where: { email: data.email },
      select: { id: true },
    })

    if (teacherWithEmail) {
      return {
        success: false,
        error: 'Já existe um(a) professor(a) com esse e-mail.',
      }
    }

    const syncedUser = await syncTeacherUser(data.name, data.email)
    if (!syncedUser.success) {
      return syncedUser
    }

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
    const teacherWithEmail = await prisma.teacher.findFirst({
      where: {
        email: data.email,
        id: { not: id },
      },
      select: { id: true },
    })

    if (teacherWithEmail) {
      return {
        success: false,
        error: 'Já existe um(a) professor(a) com esse e-mail.',
      }
    }

    const currentTeacher = await prisma.teacher.findUnique({
      where: { id },
      select: { email: true },
    })

    if (!currentTeacher) {
      return {
        success: false,
        error: ERROR_MESSAGES.TEACHER_NOT_FOUND,
      }
    }

    const syncedUser = await syncTeacherUser(data.name, data.email)
    if (!syncedUser.success) {
      return syncedUser
    }

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

    if (currentTeacher.email !== data.email) {
      await prisma.user.deleteMany({
        where: {
          email: currentTeacher.email,
          role: 'prof',
        },
      })
    }

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
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { email: true },
    })

    if (!teacher) {
      return {
        success: false,
        error: ERROR_MESSAGES.TEACHER_NOT_FOUND,
      }
    }

    await prisma.teacher.delete({
      where: { id },
    })

    await prisma.user.deleteMany({
      where: {
        email: teacher.email,
        role: 'prof',
      },
    })

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
