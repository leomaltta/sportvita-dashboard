import { NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(120, 'Nome muito longo'),
  email: z.string().email('E-mail invalido').max(180, 'E-mail muito longo'),
  subject: z.string().min(3, 'Assunto muito curto').max(160, 'Assunto muito longo'),
  message: z.string().min(10, 'Mensagem muito curta').max(3000, 'Mensagem muito longa'),
})

function cleanEnvValue(value?: string) {
  if (!value) return undefined
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function parseResendError(details: string) {
  try {
    const json = JSON.parse(details) as { message?: string; name?: string }
    return json.message ?? json.name ?? details
  } catch {
    return details
  }
}

export async function POST(request: Request) {
  const parsedBody = contactSchema.safeParse(await request.json())

  if (!parsedBody.success) {
    const fieldErrors = parsedBody.error.flatten().fieldErrors
    return NextResponse.json(
      { error: 'Dados invalidos', fieldErrors },
      { status: 400 },
    )
  }

  const resendApiKey = cleanEnvValue(process.env.RESEND_API_KEY)
  const toEmail = cleanEnvValue(process.env.CONTACT_TO_EMAIL)
  const fromEmail =
    cleanEnvValue(process.env.CONTACT_FROM_EMAIL) ?? 'Sport Vita <onboarding@resend.dev>'

  if (!resendApiKey || !toEmail) {
    return NextResponse.json(
      {
        error:
          'Contato indisponivel no momento. Configure RESEND_API_KEY e CONTACT_TO_EMAIL.',
      },
      { status: 500 },
    )
  }

  const { name, email, subject, message } = parsedBody.data

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Sport Vita] ${subject}`,
        text: `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`,
      }),
    })

    if (!response.ok) {
      const rawDetails = await response.text()
      const details = parseResendError(rawDetails)
      return NextResponse.json(
        { error: 'Falha ao enviar mensagem', details },
        { status: 502 },
      )
    }

    return NextResponse.json(
      { ok: true, message: 'Mensagem enviada com sucesso.' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao conectar com o servico de e-mail.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    )
  }
}
