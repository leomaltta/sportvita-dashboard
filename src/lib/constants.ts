
export const SPORTS = [
    { value: 'Futsal', label: 'Futsal' },
    { value: 'Basquete', label: 'Basquete' },
    { value: 'Voleibol', label: 'Voleibol' },
    { value: 'Handebol', label: 'Handebol' },
    { value: 'Judo', label: 'Judô' },
    { value: 'Karate', label: 'Karatê' },
    { value: 'Gr', label: 'Ginástica Rítmica' },
    { value: 'Danca', label: 'Dança' },
    { value: 'Natacao', label: 'Natação' },
  ] as const
  
  export const SUB_CATEGORIES = [
    { value: 'Sub-6', label: 'Sub-6' },
    { value: 'Sub-8', label: 'Sub-8' },
    { value: 'Sub-10', label: 'Sub-10' },
    { value: 'Sub-12', label: 'Sub-12' },
    { value: 'Sub-14', label: 'Sub-14' },
    { value: 'Sub-17', label: 'Sub-17' },
  ] as const
  

  export const SHIFTS = [
    { value: 'Manhã', label: 'Manhã' },
    { value: 'Tarde', label: 'Tarde' },
    { value: 'Noite', label: 'Noite' },
  ] as const
  

  export const IDEAL_BMI: Record<string, number> = {
    'Sub-6': 14.68,
    'Sub-8': 16.18,
    'Sub-10': 17.78,
    'Sub-12': 19.16,
    'Sub-14': 20.19,
    'Sub-17': 20.96,
  }
  

  export const USER_ROLES = {
    ADMIN: 'admin',
    PROF: 'prof',
  } as const
  

  export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'E-mail inválido',
    INSTITUTIONAL_EMAIL: 'Use um e-mail institucional (@sebsa.com.br)',
    MIN_PASSWORD: 'A senha deve ter no mínimo 5 caracteres',
    INVALID_PHONE: 'Telefone inválido',
    INVALID_AGE: 'Idade deve estar entre 5 e 18 anos',
    INVALID_WEIGHT: 'Peso inválido',
    INVALID_HEIGHT: 'Altura inválida',
  } as const
  

  export const SUCCESS_MESSAGES = {
    STUDENT_CREATED: 'Estudante adicionado com sucesso!',
    STUDENT_UPDATED: 'Dados do estudante atualizados!',
    STUDENT_DELETED: 'Estudante removido com sucesso!',
    TEACHER_CREATED: 'Professor(a) adicionado(a) com sucesso!',
    TEACHER_UPDATED: 'Dados do professor(a) atualizados!',
    TEACHER_DELETED: 'Professor(a) removido(a) com sucesso!',
    PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  } as const
  

  export const ERROR_MESSAGES = {
    GENERIC: 'Ocorreu um erro. Tente novamente.',
    STUDENT_NOT_FOUND: 'Estudante não encontrado',
    TEACHER_NOT_FOUND: 'Professor(a) não encontrado(a)',
    UNAUTHORIZED: 'Você não tem permissão para essa ação',
    INVALID_CREDENTIALS: 'E-mail ou senha incorretos',
    DATABASE_ERROR: 'Erro ao acessar o banco de dados',
  } as const
  

  export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    STUDENTS: '/estudantes',
    TEACHERS: '/professores',
    SPORTS: '/esportes',
    ADMIN: '/admin',
    DENIED: '/denied',
  } as const

  
  export const SPORT_IDS: Record<string, number> = {
    Futsal: 1,
    Basquete: 2,
    Voleibol: 3,
    Judo: 4,
    Karate: 5,
    Gr: 6,
    Danca: 7,
    Natacao: 8,
    Handebol: 9,
  }