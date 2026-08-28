import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email/send'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es obligatorio' }, { status: 400 })
    }

    // Buscar al usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'No se encontró ninguna cuenta con este correo' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Este correo electrónico ya ha sido verificado' }, { status: 400 })
    }

    // Validar límite de reenvío de 2 minutos (servidor serverless friendly mediante base de datos)
    const DOS_MINUTOS_MS = 2 * 60 * 1000
    if (user.lastVerificationSentAt) {
      const transcurrido = Date.now() - new Date(user.lastVerificationSentAt).getTime()
      if (transcurrido < DOS_MINUTOS_MS) {
        const segundosRestantes = Math.ceil((DOS_MINUTOS_MS - transcurrido) / 1000)
        return NextResponse.json({
          error: `Por favor espera ${segundosRestantes} segundos antes de solicitar otro correo.`
        }, { status: 429 })
      }
    }

    // Generar nuevos datos del token
    const newToken = crypto.randomUUID()
    const newTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Guardar cambios en BD
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: newToken,
        verificationTokenExpiry: newTokenExpiry,
        lastVerificationSentAt: new Date()
      }
    })

    // Enviar el correo de forma asíncrona sin bloquear la respuesta de la API
    sendVerificationEmail(email, newToken).catch((err) => {
      console.error('Error asíncrono reenviando verificación:', err)
    })

    return NextResponse.json({ success: true, message: 'Correo de verificación reenviado con éxito.' })

  } catch (error) {
    console.error('Error en API reenviar-verificacion:', error)
    return NextResponse.json({ error: 'Ocurrió un error al procesar el reenvío' }, { status: 500 })
  }
}
