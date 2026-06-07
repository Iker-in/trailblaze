import prisma from '../config/prisma.js'

const achievements = [
  {
    name: 'Primer Paso',
    description: 'Completa tu primera ruta',
    points: 10,
    criterio: 'completions_1'
  },
  {
    name: 'Explorador',
    description: 'Completa 5 rutas',
    points: 25,
    criterio: 'completions_5'
  },
  {
    name: 'Aventurero',
    description: 'Completa 10 rutas',
    points: 50,
    criterio: 'completions_10'
  },
  {
    name: 'Creador',
    description: 'Publica tu primera ruta',
    points: 15,
    criterio: 'routes_1'
  },
  {
    name: 'Cartografo',
    description: 'Publica 5 rutas',
    points: 40,
    criterio: 'routes_5'
  },
  {
    name: 'Social',
    description: 'Consigue tu primer seguidor',
    points: 10,
    criterio: 'followers_1'
  },
  {
    name: 'Centurion',
    description: 'Acumula 100 puntos',
    points: 20,
    criterio: 'points_100'
  },
  {
    name: 'Leyenda',
    description: 'Acumula 500 puntos',
    points: 100,
    criterio: 'points_500'
  }
]

const seed = async () => {
  console.log('Insertando logros...')

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement
    })
  }

  console.log('Logros insertados correctamente')
  await prisma.$disconnect()
}

seed().catch(console.error)