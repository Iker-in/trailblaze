import prisma from './src/config/prisma.js'
await prisma.achievement.upsert({
  where: { name: 'Primer Explorador' },
  update: {},
  create: {
    name: 'Primer Explorador',
    description: 'Fuiste el primero en completar esta ruta',
    points: 50,
    criterio: 'first_explorer',
    iconUrl: '🏆'
  }
})
console.log('Achievement creado')
await prisma.$disconnect()
