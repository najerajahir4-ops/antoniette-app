/**
 * Plantillas HTML de correo electrónico premium para Antoniette
 */

export function getVerificationEmailHtml(name: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirma tu correo en Antoniette</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #1A1D18; font-family: 'Georgia', serif; color: #FFFFFF; -webkit-font-smoothing: antialiased; text-align: center;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1A1D18; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #212520; border: 1px solid #C9A961; border-radius: 8px; padding: 40px; text-align: left;">
              
              <!-- Logo / Encabezado -->
              <tr>
                <td align="center" style="padding-bottom: 30px; border-bottom: 1px solid rgba(201, 169, 97, 0.2);">
                  <h1 style="color: #C9A961; margin: 0; font-family: 'Playfair Display', 'Georgia', serif; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">Antoniette</h1>
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 5px 0 0 0; font-size: 10px; tracking: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Rooftop & Cucina Italiana</p>
                </td>
              </tr>

              <!-- Cuerpo de Mensaje -->
              <tr>
                <td style="padding: 40px 0 20px 0;">
                  <h2 style="color: #C9A961; font-size: 20px; font-weight: normal; margin-top: 0; font-family: 'Playfair Display', 'Georgia', serif;">¡Hola!</h2>
                  <p style="font-size: 15px; line-height: 1.6; color: #E5E7EB; font-family: Arial, sans-serif;">
                    Te damos una cálida bienvenida a <strong>Antoniette</strong>. Para poder realizar reservas interactivas de nuestras mesas exclusivas en la terraza y dejarnos tus valiosas opiniones, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace dorado.
                  </p>
                </td>
              </tr>

              <!-- Botón de Confirmación -->
              <tr>
                <td align="center" style="padding: 20px 0 30px 0;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" bgcolor="#C9A961" style="border-radius: 4px;">
                        <a href="${verificationUrl}" target="_blank" style="font-size: 14px; font-family: Arial, sans-serif; color: #1A1D18; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: bold; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">
                          Confirmar mi correo
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Nota de Expiración -->
              <tr>
                <td style="padding-top: 20px; border-top: 1px solid rgba(201, 169, 97, 0.2);">
                  <p style="font-size: 12px; line-height: 1.5; color: rgba(255, 255, 255, 0.4); font-family: Arial, sans-serif; margin: 0;">
                    Este enlace de confirmación es válido por las próximas <strong>24 horas</strong>. Si tú no creaste esta cuenta, puedes ignorar este mensaje de forma segura.
                  </p>
                </td>
              </tr>

              <!-- Pie de página -->
              <tr>
                <td align="center" style="padding-top: 40px;">
                  <p style="font-size: 11px; color: rgba(255, 255, 255, 0.3); font-family: Arial, sans-serif; margin: 0; text-align: center;">
                    © ${new Date().getFullYear()} Antoniette Rooftop. Todos los derechos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
