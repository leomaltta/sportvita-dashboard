import {
  AlertItem,
  buildFilterQuery,
  filterAlerts,
  getSeverityClassName,
  parseMultiParam,
} from './alerts'

const mockAlerts: AlertItem[] = [
  {
    sportName: 'Basquete',
    sportDisplayName: 'Basquete',
    sportRoute: 'basquete',
    subCategory: 'Sub-10',
    studentsCount: 20,
    avgBmi: 22.1,
    idealBmi: 17.78,
    bmiGap: 4.32,
    outOfRangeRate: 55.0,
    normalRate: 45.0,
    severity: 'Crítico',
    recommendation: 'Reforçar acompanhamento semanal.',
  },
  {
    sportName: 'Futsal',
    sportDisplayName: 'Futsal',
    sportRoute: 'futsal',
    subCategory: 'Sub-8',
    studentsCount: 18,
    avgBmi: 19.4,
    idealBmi: 16.18,
    bmiGap: 3.22,
    outOfRangeRate: 33.3,
    normalRate: 66.7,
    severity: 'Atenção',
    recommendation: 'Monitorar evolução quinzenal.',
  },
  {
    sportName: 'Natacao',
    sportDisplayName: 'Natação',
    sportRoute: 'natacao',
    subCategory: 'Sub-12',
    studentsCount: 12,
    avgBmi: 18.9,
    idealBmi: 19.16,
    bmiGap: 0.26,
    outOfRangeRate: 20.0,
    normalRate: 80.0,
    severity: 'Monitorar',
    recommendation: 'Manter monitoramento mensal.',
  },
]

describe('alerts utils', () => {
  it('parseMultiParam splits and trims values', () => {
    expect(parseMultiParam('Basquete, Futsal ,Natacao')).toEqual([
      'Basquete',
      'Futsal',
      'Natacao',
    ])
  })

  it('parseMultiParam returns empty array for undefined/null', () => {
    expect(parseMultiParam(undefined)).toEqual([])
    expect(parseMultiParam(null)).toEqual([])
  })

  it('buildFilterQuery creates deterministic query string', () => {
    const query = buildFilterQuery({
      sports: ['Basquete', 'Futsal'],
      subcategories: ['Sub-10'],
      severities: ['Crítico'],
    })

    expect(query).toBe('esporte=Basquete%2CFutsal&sub=Sub-10&severidade=Cr%C3%ADtico')
  })

  it('filterAlerts applies combined filters', () => {
    const filtered = filterAlerts(mockAlerts, {
      sports: ['Futsal'],
      subcategories: ['Sub-8'],
      severities: ['Atenção'],
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].sportName).toBe('Futsal')
    expect(filtered[0].severity).toBe('Atenção')
  })

  it('filterAlerts returns all alerts when no filters are provided', () => {
    const filtered = filterAlerts(mockAlerts, {})
    expect(filtered).toHaveLength(3)
  })

  it('getSeverityClassName maps each severity to expected color token', () => {
    expect(getSeverityClassName('Crítico')).toContain('text-red-700')
    expect(getSeverityClassName('Atenção')).toContain('text-orange-700')
    expect(getSeverityClassName('Monitorar')).toContain('text-green-700')
  })
})
