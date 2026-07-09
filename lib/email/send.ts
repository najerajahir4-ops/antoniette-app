import { Resend } from 'resend'
import { getVerificationEmailHtml } from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY no está configurada. El correo de verificación no se enviará.')
      return { success: false, error: 'API Key missing' }
    }

    const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${domain}/verificar-correo?token=${token}`

    // Mientras no tengamos dominio verificado, usamos onboarding@resend.dev
    // Remitente personalizado como "Antoniette <onboarding@resend.dev>"
    const { data, error } = await resend.emails.send({
      from: 'Antoniette <onboarding@resend.dev>',
      to: email,
      subject: 'Confirma tu correo y reserva tu mesa en Antoniette 🍷',
      html: getVerificationEmailHtml(email, verificationUrl),
    })

    if (error) {
      console.error('Error enviando correo con Resend:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Excepción al enviar correo con Resend:', error)
    return { success: false, error }
  }
}
