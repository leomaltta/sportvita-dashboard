import bcrypt from 'bcrypt'
import prisma from './client'

async function main() {
  console.log('Seeding shifts...')
  const shifts = await prisma.shift.createMany({
    data: [
      { name: 'Manhã' },
      { name: 'Tarde' },
      { name: 'Noite' },
    ],
    skipDuplicates: true,
  })
  console.log(`Created ${shifts.count} shifts\n`)
  console.log('Seeding sub-categories...')
  const subs = await prisma.subCategory.createMany({
    data: [
      { name: 'Sub-6', idealBMI: 14.68 },
      { name: 'Sub-8', idealBMI: 16.18 },
      { name: 'Sub-10', idealBMI: 17.78 },
      { name: 'Sub-12', idealBMI: 19.16 },
      { name: 'Sub-14', idealBMI: 20.19 },
      { name: 'Sub-17', idealBMI: 20.96 },
    ],
    skipDuplicates: true,
  })
  console.log(`Created ${subs.count} sub-categories\n`)
  console.log('Seeding ideal BMI values...')
  const imcIdeal = await prisma.idealBMI.createMany({
    data: [
      { subCategory: 'Sub-6', bmiValue: 14.68 },
      { subCategory: 'Sub-8', bmiValue: 16.18 },
      { subCategory: 'Sub-10', bmiValue: 17.78 },
      { subCategory: 'Sub-12', bmiValue: 19.16 },
      { subCategory: 'Sub-14', bmiValue: 20.19 },
      { subCategory: 'Sub-17', bmiValue: 20.96 },
    ],
    skipDuplicates: true,
  })
  console.log(`Created ${imcIdeal.count} ideal BMI records\n`)


  console.log('Seeding sports...')
  const sports = await prisma.sport.createMany({
    data: [
      {
        name: 'Futsal',
        alterName: 'Futsal',
        route: 'futsal',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      },
      {
        name: 'Basquete',
        alterName: 'Basquete',
        route: 'basquete',
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      },
      {
        name: 'Voleibol',
        alterName: 'Voleibol',
        route: 'voleibol',
        imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
      },
      {
        name: 'Handebol',
        alterName: 'Handebol',
        route: 'handebol',
        imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
      },
      {
        name: 'Judo',
        alterName: 'Judô',
        route: 'judo',
        imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
      },
      {
        name: 'Karate',
        alterName: 'Karatê',
        route: 'karate',
        imageUrl: 'https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=800',
      },
      {
        name: 'Gr',
        alterName: 'Ginástica Rítmica',
        route: 'gr',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
      },
      {
        name: 'Danca',
        alterName: 'Dança',
        route: 'danca',
        imageUrl: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800',
      },
      {
        name: 'Natacao',
        alterName: 'Natação',
        route: 'natacao',
        imageUrl: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800',
      },
    ],
    skipDuplicates: true,
  })
  console.log(`Created ${sports.count} sports\n`)
  console.log('Seeding admin user...')
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@sportvita.com'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@12345'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log(`Admin user ready: ${adminEmail}`)
  console.log('Database seeding completed successfully!')
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
