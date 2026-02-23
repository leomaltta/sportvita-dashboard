'use server'

import bcrypt from 'bcrypt'
import prisma from '../../../prisma/client'
import { ApiResponse } from '@/types'
import { isValidEmail } from '../validation'

interface CreateUserInput {
  name: string
  email: string
  image?: string
  password: string
  role: string
}

export async function updateUser(
  email: string,
  data: { name: string; email: string; image?: string },
): Promise<ApiResponse> {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        name: data.name,
        email: data.email,
        image: data.image || null,
      },
    })

    return { success: true, message: 'Perfil atualizado com sucesso!' }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Erro ao atualizar perfil' }
  }
}

export async function createUser(data: CreateUserInput): Promise<ApiResponse> {
  try {
    if (!data.name.trim()) {
      return { success: false, error: 'Nome é obrigatório' }
    }

    if (!isValidEmail(data.email)) {
      return { success: false, error: 'E-mail inválido' }
    }

    if (!data.password || data.password.length < 5) {
      return {
        success: false,
        error: 'A senha deve ter no mínimo 5 caracteres',
      }
    }

    if (!['admin', 'prof'].includes(data.role)) {
      return { success: false, error: 'Role inválida' }
    }

    if (data.role === 'prof') {
      const teacher = await prisma.teacher.findFirst({
        where: { email: data.email },
        select: { id: true },
      })

      if (!teacher) {
        return {
          success: false,
          error:
            'Para criar um usuário professor, primeiro cadastre o professor com o mesmo e-mail.',
        }
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    })

    if (existingUser) {
      return { success: false, error: 'Já existe um usuário com esse e-mail' }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        image: data.image || null,
        password: hashedPassword,
        role: data.role,
      },
    })

    return { success: true, message: 'Usuário criado com sucesso!' }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Erro ao criar usuário' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
