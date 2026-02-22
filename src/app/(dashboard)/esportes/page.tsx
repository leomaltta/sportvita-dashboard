import prisma from '../../../../prisma/client'
import SportCard from '@/components/cards/sport-card'

export default async function SportsPage() {
  const sports = await prisma.sport.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="min-h-screen">
      <section className="mx-5 mt-8 min-[425px]:mx-6 md:mx-10">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          Esportes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Galeria de modalidades com acesso rápido às análises.
        </p>
      </section>

      <section className="mx-5 my-8 grid grid-cols-1 gap-6 min-[425px]:mx-6 md:mx-10 md:grid-cols-2 xl:grid-cols-3">
        {sports.map((sport) => (
          <SportCard
            key={sport.id}
            sportRoute={sport.route}
            sportName={sport.name}
            sportImg={sport.imageUrl}
            alterName={sport.alterName}
          />
        ))}
      </section>
    </main>
  )
}
