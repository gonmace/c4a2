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
          <p><strong>Mensaje:</strong> ${formData.message}</p>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Error de Brevo:', errorText);
      return new Response(JSON.stringify({
        message: "Error al enviar el email"
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      message: "Email enviado correctamente"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
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