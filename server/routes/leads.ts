import { Router } from 'express';
import { db } from '../db.js';
import { leads } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

function transformLeadForClient(lead: any) {
  return {
    id: lead.id,
    etapa: lead.etapa,
    assignedUserId: lead.assignedUserId,
    isConverted: lead.isConverted,
    nombre_empresa: lead.nombreEmpresa,
    nombre_contacto: lead.nombreContacto,
    sector: lead.sector,
    ciudad: lead.ciudad,
    telefono: lead.telefono,
    email: lead.email,
    email_secundario: lead.emailSecundario,
    web: lead.web,
    fuente_origen: lead.fuenteOrigen,
    servicio_interes: lead.servicioInteres,
    necesidad: lead.necesidad,
    fecha_envio_propuesta: lead.fechaEnvioPropuesta,
    valor_implementacion: lead.valorImplementacion,
    valor_mensualidad: lead.valorMensualidad,
    fecha_primer_contacto: lead.fechaPrimerContacto,
    comentarios: lead.comentarios,
    resultado_final: lead.resultadoFinal,
    fecha_cierre_real: lead.fechaCierreReal,
    hitos: lead.hitos,
    isDeleted: lead.isDeleted,
    deletedAt: lead.deletedAt,
    coverUrl: lead.coverUrl,
    coverPosition: lead.coverPosition,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

function normalizeServicioInteres(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
}

function transformLeadFromClient(data: any) {
  const rawServicio = data.servicioInteres || data.servicio_interes;
  return {
    etapa: data.etapa,
    assignedUserId: data.assignedUserId ? Number(data.assignedUserId) : null,
    isConverted: data.isConverted,
    nombreEmpresa: data.nombreEmpresa || data.nombre_empresa,
    nombreContacto: data.nombreContacto || data.nombre_contacto,
    sector: data.sector,
    ciudad: data.ciudad,
    telefono: data.telefono,
    email: data.email,
    emailSecundario: data.emailSecundario || data.email_secundario,
    web: data.web,
    fuenteOrigen: data.fuenteOrigen || data.fuente_origen,
    servicioInteres: normalizeServicioInteres(rawServicio),
    necesidad: data.necesidad,
    fechaEnvioPropuesta: data.fechaEnvioPropuesta || data.fecha_envio_propuesta,
    valorImplementacion: data.valorImplementacion || data.valor_implementacion,
    valorMensualidad: data.valorMensualidad || data.valor_mensualidad,
    fechaPrimerContacto: data.fechaPrimerContacto || data.fecha_primer_contacto,
    comentarios: data.comentarios,
    resultadoFinal: data.resultadoFinal || data.resultado_final,
    fechaCierreReal: data.fechaCierreReal || data.fecha_cierre_real,
    hitos: data.hitos,
    coverUrl: data.coverUrl,
    coverPosition: data.coverPosition,
  };
}

router.get('/', async (req, res) => {
  try {
    const allLeads = await db.select().from(leads).where(eq(leads.isDeleted, false));
    res.json(allLeads.map(transformLeadForClient));
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const leadData = transformLeadFromClient(req.body);
    const [newLead] = await db.insert(leads).values(leadData).returning();
    res.status(201).json(transformLeadForClient(newLead));
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[DEBUG] Lead update - received coverUrl:', req.body.coverUrl ? 'YES (length: ' + req.body.coverUrl.length + ')' : 'NO');
    const leadData = transformLeadFromClient(req.body);
    console.log('[DEBUG] Lead update - transformed coverUrl:', leadData.coverUrl ? 'YES' : 'NO');
    const [updatedLead] = await db.update(leads)
      .set({ ...leadData, updatedAt: new Date() })
      .where(eq(leads.id, Number(id)))
      .returning();
    console.log('[DEBUG] Lead update - saved coverUrl:', updatedLead.coverUrl ? 'YES' : 'NO');
    res.json(transformLeadForClient(updatedLead));
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(leads)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(leads.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
