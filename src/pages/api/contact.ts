import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { nombre, empresa, email, telefono, servicio, mensaje } = data;

    if (!nombre || !email) {
      return new Response(
        JSON.stringify({ error: 'Nombre y correo son obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: import.meta.env.ZOHO_EMAIL,
        pass: import.meta.env.ZOHO_PASSWORD,
      },
    });

    const servicioLabels: Record<string, string> = {
      supervision: 'Supervisión de Obras',
      bim: 'Gerencia BIM',
      sst: 'Gestión SST',
      ambiental: 'Monitoreo Ambiental',
      calidad: 'Control de Calidad',
      obras: 'Ejecución de Obras',
      ingenieria: 'Ingeniería y Diseño',
      comercializacion: 'Comercialización',
    };

    const servicioText = servicio ? servicioLabels[servicio] || servicio : 'No especificado';

    await transporter.sendMail({
      from: `"IAAS Web" <${import.meta.env.ZOHO_EMAIL}>`,
      to: 'proyectos@iaasperu.com',
      replyTo: email,
      subject: `Nueva solicitud de ${nombre} - ${servicioText}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
  <div style="background:#072a4a;padding:28px 32px;">
    <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">IAAS</h1>
    <p style="margin:4px 0 0;font-size:12px;color:#7baed4;">Nueva solicitud de cotización</p>
  </div>
  <div style="padding:28px 32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#6b7280;font-size:13px;width:120px;">Nombre</td>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#072a4a;font-size:14px;font-weight:600;">${nombre}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#6b7280;font-size:13px;">Empresa</td>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#1a1a1a;font-size:14px;">${empresa || '—'}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#6b7280;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;font-size:14px;"><a href="mailto:${email}" style="color:#0a4d8c;text-decoration:none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#6b7280;font-size:13px;">Teléfono</td>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#1a1a1a;font-size:14px;">${telefono || '—'}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#6b7280;font-size:13px;">Servicio</td>
        <td style="padding:10px 0;border-bottom:1px solid #eef2f6;color:#0a4d8c;font-size:14px;font-weight:600;">${servicioText}</td>
      </tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#f7f9fc;border-left:3px solid #0a4d8c;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;">Mensaje</p>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.6;">${mensaje || 'Sin mensaje adicional.'}</p>
    </div>
    <div style="margin-top:24px;text-align:center;">
      <a href="mailto:${email}" style="display:inline-block;background:#0a4d8c;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;padding:10px 28px;border-radius:6px;">Responder</a>
    </div>
  </div>
  <div style="background:#f7f9fc;padding:16px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9ca3af;">Enviado desde el formulario de iaasperu.com</p>
  </div>
</div>`,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Solicitud enviada correctamente.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error enviando email:', error);
    return new Response(
      JSON.stringify({ error: 'Error al enviar el mensaje. Intente nuevamente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
