import { IDEAL_BMI } from '@/lib/constants'

type SubCalorieMap = Record<string, number>

interface SportCalorieProfile {
  general: number
  sub: SubCalorieMap
}

interface SportEducationalProfile {
  muscles: string[]
  physicalBenefits: string[]
  cognitiveBenefits: string[]
  idealStartAge: string
}

const SUB_AGES: Record<string, number> = {
  'Sub-6': 6,
  'Sub-8': 8,
  'Sub-10': 10,
  'Sub-12': 12,
  'Sub-14': 14,
  'Sub-17': 17,
}

function interpolate(
  anchors: Record<number, number>,
  ages: number[],
): Record<number, number> {
  const anchorAges = Object.keys(anchors)
    .map(Number)
    .sort((a, b) => a - b)
  const result: Record<number, number> = {}

  for (const age of ages) {
    if (anchors[age] !== undefined) {
      result[age] = anchors[age]
      continue
    }

    let left = anchorAges[0]
    let right = anchorAges[anchorAges.length - 1]

    for (let i = 0; i < anchorAges.length - 1; i++) {
      if (age >= anchorAges[i] && age <= anchorAges[i + 1]) {
        left = anchorAges[i]
        right = anchorAges[i + 1]
        break
      }
    }

    const ratio = (age - left) / (right - left)
    result[age] = Math.round(anchors[left] + (anchors[right] - anchors[left]) * ratio)
  }

  return result
}

function buildSubMap(anchors: Record<number, number>): SubCalorieMap {
  const interpolated = interpolate(anchors, Object.values(SUB_AGES))
  return Object.fromEntries(
    Object.entries(SUB_AGES).map(([sub, age]) => [sub, interpolated[age]]),
  )
}

const calorieTable: Record<string, SportCalorieProfile> = {
  Futsal: {
    general: 500,
    sub: buildSubMap({ 6: 180, 9: 250, 12: 340, 15: 430, 18: 500 }),
  },
  Basquete: {
    general: 480,
    sub: buildSubMap({ 6: 170, 9: 240, 12: 320, 15: 420, 18: 480 }),
  },
  Voleibol: {
    general: 350,
    sub: buildSubMap({ 6: 130, 9: 190, 12: 260, 15: 330, 18: 370 }),
  },
  Natacao: {
    general: 550,
    sub: buildSubMap({ 6: 200, 9: 280, 12: 370, 15: 470, 18: 550 }),
  },
  Handebol: {
    general: 520,
    sub: buildSubMap({ 6: 190, 9: 260, 12: 350, 15: 440, 18: 520 }),
  },
  Judo: {
    general: 460,
    sub: buildSubMap({ 6: 165, 9: 230, 12: 305, 15: 390, 18: 460 }),
  },
  Karate: {
    general: 430,
    sub: buildSubMap({ 6: 155, 9: 215, 12: 285, 15: 360, 18: 430 }),
  },
  Gr: {
    general: 320,
    sub: buildSubMap({ 6: 120, 9: 170, 12: 230, 15: 290, 18: 320 }),
  },
  Danca: {
    general: 340,
    sub: buildSubMap({ 6: 125, 9: 180, 12: 240, 15: 305, 18: 340 }),
  },
}

const educationalProfileByRoute: Record<string, SportEducationalProfile> = {
  futsal: {
    muscles: ['Quadríceps', 'Panturrilhas', 'Core', 'Glúteos'],
    physicalBenefits: ['Resistência cardiorrespiratória', 'Agilidade', 'Coordenação motora'],
    cognitiveBenefits: ['Tomada de decisão rápida', 'Leitura tática', 'Trabalho em equipe'],
    idealStartAge: 'A partir de 6 anos, com progressão técnica gradual.',
  },
  basquete: {
    muscles: ['Pernas', 'Core', 'Deltoides', 'Antebraços'],
    physicalBenefits: ['Explosão muscular', 'Velocidade', 'Controle corporal'],
    cognitiveBenefits: ['Atenção dividida', 'Estratégia coletiva', 'Autoconfiança'],
    idealStartAge: 'A partir de 7 anos, focando fundamentos e coordenação.',
  },
  voleibol: {
    muscles: ['Ombros', 'Core', 'Pernas', 'Peitoral'],
    physicalBenefits: ['Impulsão', 'Coordenação fina', 'Resistência'],
    cognitiveBenefits: ['Sincronização em grupo', 'Antecipação', 'Disciplina'],
    idealStartAge: 'A partir de 8 anos, com adaptação progressiva de carga.',
  },
  natacao: {
    muscles: ['Dorsais', 'Ombros', 'Core', 'Pernas'],
    physicalBenefits: ['Capacidade pulmonar', 'Resistência global', 'Baixo impacto articular'],
    cognitiveBenefits: ['Autocontrole', 'Foco', 'Consciência corporal'],
    idealStartAge: 'A partir de 6 anos, com técnica e segurança aquática.',
  },
  handebol: {
    muscles: ['Pernas', 'Ombros', 'Core', 'Tríceps'],
    physicalBenefits: ['Potência', 'Velocidade de reação', 'Resistência anaeróbica'],
    cognitiveBenefits: ['Visão de jogo', 'Tomada de decisão', 'Comunicação em equipe'],
    idealStartAge: 'A partir de 8 anos, com foco em fundamentos e prevenção de lesão.',
  },
  judo: {
    muscles: ['Core', 'Costas', 'Antebraços', 'Pernas'],
    physicalBenefits: ['Força funcional', 'Equilíbrio', 'Mobilidade'],
    cognitiveBenefits: ['Autocontrole emocional', 'Disciplina', 'Resolução de conflito'],
    idealStartAge: 'A partir de 7 anos, com ênfase em técnica e respeito.',
  },
  karate: {
    muscles: ['Core', 'Quadríceps', 'Glúteos', 'Deltoides'],
    physicalBenefits: ['Coordenação', 'Potência de membros', 'Flexibilidade'],
    cognitiveBenefits: ['Concentração', 'Disciplina', 'Confiança'],
    idealStartAge: 'A partir de 6 anos, com progressão por faixas e técnica.',
  },
  gr: {
    muscles: ['Core', 'Adutores', 'Glúteos', 'Lombar'],
    physicalBenefits: ['Flexibilidade', 'Postura', 'Controle motor fino'],
    cognitiveBenefits: ['Expressão corporal', 'Memória motora', 'Foco'],
    idealStartAge: 'A partir de 6 anos, com treino técnico e lúdico.',
  },
  danca: {
    muscles: ['Pernas', 'Core', 'Glúteos', 'Costas'],
    physicalBenefits: ['Coordenação', 'Resistência', 'Mobilidade'],
    cognitiveBenefits: ['Criatividade', 'Ritmo', 'Expressão emocional'],
    idealStartAge: 'A partir de 6 anos, com estímulo progressivo de técnica.',
  },
}

export function getSportCalorieProfile(sportName: string): SportCalorieProfile {
  return calorieTable[sportName] ?? {
    general: 380,
    sub: Object.fromEntries(Object.keys(IDEAL_BMI).map((sub) => [sub, 220])),
  }
}

export function getCalorieRanking() {
  return Object.entries(calorieTable)
    .map(([sportName, profile]) => ({
      sportName,
      calories: profile.general,
    }))
    .sort((a, b) => b.calories - a.calories)
}

export function getSportEducationalProfile(route: string): SportEducationalProfile {
  return (
    educationalProfileByRoute[route] ?? {
      muscles: ['Core', 'Membros inferiores', 'Membros superiores'],
      physicalBenefits: ['Resistência', 'Coordenação', 'Condicionamento físico'],
      cognitiveBenefits: ['Foco', 'Disciplina', 'Trabalho em equipe'],
      idealStartAge: 'Iniciação esportiva progressiva conforme orientação pedagógica.',
    }
  )
}

