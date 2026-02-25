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
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')?.trim() ?? ''
  const ids = parseIds(searchParams.get('ids'))

  const where: Prisma.TeacherWhereInput = {}

  if (search.length > 0) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { registrationCode: { contains: search, mode: 'insensitive' } },
      { sport: { alterName: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (ids.length > 0) {
    where.id = { in: ids }
  }

  const teachers = await prisma.teacher.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      sport: {
        select: { alterName: true },
      },
    },
  })

  const header = [
    'ID',
    'Nome',
    'E-mail',
    'Matrícula',
    'Esporte',
    'Subcategoria',
    'Turno',
  ]

  const rows = teachers.map((teacher) => [
    teacher.id.toString(),
    teacher.name,
    teacher.email,
    teacher.registrationCode,
    teacher.sport.alterName,
    teacher.subCategory,
    teacher.shift,
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
      'Content-Disposition': `attachment; filename="professores-${timestamp}.csv"`,
    },
  })
}
