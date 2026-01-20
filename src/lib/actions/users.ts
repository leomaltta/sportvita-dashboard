'use server'

import prisma from '../../../prisma/client'
import { ApiResponse } from '@/types'

/**
 * Updates user profile
 * 
 * @param email - User email (identifier)
 * @param data - Updated user data
 * @returns API response with success/error
 */
export async function updateUser(
  email: string,
  data: { name: string; email: string },
): Promise<ApiResponse> {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        name: data.name,
        email: data.email,
      },
    })

    return { success: true, message: 'Perfil atualizado com sucesso!' }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Erro ao atualizar perfil' }
  }
}

/**
 * Gets user by email
 * 
 * @param email - User email
 * @returns User object or null
 */
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