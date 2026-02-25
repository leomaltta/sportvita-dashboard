import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '../../../../../prisma/client'

function parseIds(value: string | null): bigint[] {
  if (!value) return []

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => /^\d+$/.test(item))
    .map((item) => BigInt(item))
}

function escapeCsv(value: string | number | null) {
  if (value === null) return '""'
  return `"${String(value).replaceAll('"', '""')}"`
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')?.trim() ?? ''
  const ids = parseIds(searchParams.get('ids'))

  const where: Prisma.StudentWhereInput = {}

  if (session.user.role === 'prof') {
    const teacher = await prisma.teacher.findFirst({
      where: { email: session.user.email ?? '' },
      include: {
        sport: {
          select: { name: true },
        },
      },
    })

    if (!teacher?.sport?.name) {
      return NextResponse.json({ error: 'Professor sem esporte vinculado' }, { status: 403 })
    }

    where.sportName = teacher.sport.name
  } else if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  if (search.length > 0) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { registrationCode: { contains: search, mode: 'insensitive' } },
      { sportAlterName: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (ids.length > 0) {
    where.id = { in: ids }
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      registrationCode: true,
      phoneNumber: true,
      age: true,
      sportAlterName: true,
      subCategory: true,
      shift: true,
      weight: true,
      height: true,
    },
  })

  const header = [
    'ID',
    'Nome',
    'Matrícula',
    'Telefone',
    'Idade',
    'Esporte',
    'Subcategoria',
    'Turno',
    'Peso',
    'Altura',
    'IMC',
  ]

  const rows = students.map((student) => [
    student.id.toString(),
    student.name,
    student.registrationCode,
    student.phoneNumber ?? '',
    String(student.age),
    student.sportAlterName,
    student.subCategory,
    student.shift,
    student.weight.toFixed(1),
    student.height.toFixed(2),
    (student.weight / (student.height * student.height)).toFixed(2),
  ])

  const csvBody = [header, ...rows]
    .map((cols) => cols.map((col) => escapeCsv(col)).join(','))
    .join('\n')

  const timestamp = new Date().toISOString().slice(0, 19).replaceAll(':', '-')
  const csv = `\uFEFF${csvBody}`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="estudantes-${timestamp}.csv"`,
    },
  })
}
