
'use server'

import prisma from '../../../prisma/client'
import { revalidateStudents } from './revalidation'
import { ApiResponse, StudentFormData } from '@/types'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants'

export async function createStudent(
  data: StudentFormData,
): Promise<ApiResponse> {
  try {
    await prisma.student.create({
      data: {
        name: data.nome,
        registrationCode: data.matricula,
        phoneNumber: data.telefone || null,
        age: parseInt(data.idade),
        weight: data.peso,
        height: data.altura,
        sportName: data.esporte,
        sportAlterName: data.esporte_alterName,
        subCategory: data.turma,
        shift: data.turno,
      },
    })

    // Revalidate cache
    await revalidateStudents()

    return {
      success: true,
      message: SUCCESS_MESSAGES.STUDENT_CREATED,
    }
  } catch (error) {
    console.error('Error creating student:', error)
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

export async function updateStudent(
  id: bigint,
  data: StudentFormData,
): Promise<ApiResponse> {
  try {
    await prisma.student.update({
      where: { id },
      data: {
        name: data.nome,
        registrationCode: data.matricula,
        phoneNumber: data.telefone || null,
        age: parseInt(data.idade),
        weight: data.peso,
        height: data.altura,
        sportName: data.esporte,
        sportAlterName: data.esporte_alterName,
        subCategory: data.turma,
        shift: data.turno,
      },
    })
    // Revalidate cache
    await revalidateStudents()

    return {
      success: true,
      message: SUCCESS_MESSAGES.STUDENT_UPDATED,
    }
  } catch (error) {
    console.error('Error updating student:', error)
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

export async function deleteStudent(id: bigint): Promise<ApiResponse> {
  try {
    await prisma.student.delete({
      where: { id },
    })

    // Revalidate cache
    await revalidateStudents()

    return {
      success: true,
      message: SUCCESS_MESSAGES.STUDENT_DELETED,
    }
  } catch (error) {
    console.error('Error deleting student:', error)
    return {
      success: false,
      error: ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

export async function getStudentsWithBMI() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
    })

    // Calculate BMI for each student
    return students.map((student) => ({
      ...student,
      imc: Number((student.weight / (student.height * student.height)).toFixed(2)),
    }))
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}

export async function getStudentsBySport(sportName: string) {
  try {
    const students = await prisma.student.findMany({
      where: { sportName },
      orderBy: { name: 'asc' },
    })

    return students.map((student) => ({
      ...student,
      imc: Number((student.weight / (student.height * student.height)).toFixed(2)),
    }))
  } catch (error) {
    console.error('Error fetching students by sport:', error)
    return []
  }
}


export async function getStudentById(id: bigint) {
  try {
    return await prisma.student.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return null
  }
}