import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY no está configurada');
    return new Response(JSON.stringify({
      message: "Error de configuración del servidor"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const formData = await request.json();
    
    // Validación básica de datos
    if (!formData.name || !formData.email || !formData.message) {
      return new Response(JSON.stringify({
        message: "Faltan datos requeridos"
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': import.meta.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { 
          name: "c4all",
          email: "contact@c4all.org" 
        },
        to: [{
          name: "C4All Admin",
          email: "contact@c4all.org"
        }],
        subject: `c4all - Contact`,
        htmlContent: `
          <p><strong>Nombre:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Mensaje adicional:</strong> ${formData.message || 'No se incluyó mensaje'}</p>
        `
      })
    });

    if (!emailResponse.ok) {
      console.error('Error de Brevo:', await emailResponse.text());
      throw new Error('Error al enviar el email');
    }

    const mensaje = encodeURIComponent('¡Gracias por contactarnos! Nos comunicaremos contigo en breve.');
    return new Response(null, {
      status: 303,
      headers: {
        'Location': `/?message=${mensaje}`
      }
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return new Response(JSON.stringify({
      message: "Error al procesar la solicitud"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 