
export interface Student {
    id: bigint
  name: string
  registrationCode: string
  phoneNumber: string | null
  age: number
  weight: number
  height: number
  sportName: string
  sportAlterName: string
  subCategory: string
  shift: string
  createdAt: Date
  updatedAt: Date

  }
  
  export interface StudentWithBMI extends Student {
    imc: number
  }
  
   export interface StudentFormData {
    nome: string
    matricula: string
    telefone: string
    idade: string
    esporte: string
    turma: string
    turno: string
    peso: number
    altura: number
    esporte_alterName: string
  }
  

  export interface Teacher {
    professorID: bigint
    professor_nome: string
    professor_email: string
    turno: string
    esporteID: number
    sub: string
    matricula: string
  }
  

  export interface TeacherWithSport extends Teacher {
    tb_esportes: Sport
  }
  

  export interface TeacherFormData {
    nome: string
    email: string
    matricula: string
    esporte: string
    esporteID: number
    turma: string
    turno: string
  }
  

  export interface Sport {
    esporteID: number
    esporte_name: string
    img: string
    alter_name: string
    route: string
  }

  export interface BMIStats {
    media: number
    count: number
  }
  

  export interface SportBMIStats {
    sub6?: BMIStats
    sub8: BMIStats
    sub10: BMIStats
    sub12: BMIStats
    sub14: BMIStats
    sub17: BMIStats
    media: BMIStats & {
      subDestaque: string
    }
  }

  export interface ChartDataPoint {
    name: string
    Ideal: number | string | undefined
    Atual: number | string
    amt?: number
  }

  export interface FormState {
    isSubmitting: boolean
    error: string | null
  }

  export interface SelectOption {
    value: string
    label: string
  }

  export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
  }

  export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }

  export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
  }
  export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never
  }[keyof T]