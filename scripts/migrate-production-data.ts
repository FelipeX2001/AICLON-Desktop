import { db } from '../server/db';
import { users, tasks, leads, activeClients } from '../server/schema';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function migrateProductionData() {
  console.log('=== MIGRACIÓN DE DATOS DE PRODUCCIÓN ===\n');
  
  const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../attached_assets/users_1764285790098.json'), 'utf-8'));
  const tasksData = JSON.parse(fs.readFileSync(path.join(__dirname, '../attached_assets/tasks_1764285790103.json'), 'utf-8'));
  const leadsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../attached_assets/leads_1764285790103.json'), 'utf-8'));
  const activeClientsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../attached_assets/active_clients_1764285790103.json'), 'utf-8'));
  
  console.log('Datos cargados:');
  console.log(`- Usuarios: ${usersData.length}`);
  console.log(`- Tareas: ${tasksData.length}`);
  console.log(`- Leads: ${leadsData.length}`);
  console.log(`- Clientes Activos: ${activeClientsData.length}`);
  console.log('');

  console.log('Paso 1: Limpiando tablas existentes...');
  await db.execute(sql`DELETE FROM active_clients`);
  console.log('  - active_clients limpiada');
  await db.execute(sql`DELETE FROM tasks`);
  console.log('  - tasks limpiada');
  await db.execute(sql`DELETE FROM leads`);
  console.log('  - leads limpiada');
  await db.execute(sql`DELETE FROM users`);
  console.log('  - users limpiada');

  console.log('\nPaso 2: Insertando usuarios...');
  for (const user of usersData) {
    await db.execute(sql`
      INSERT INTO users (id, name, email, avatar_url, role, password_hash, is_active, must_change_password, is_deleted, cover_url, cover_position, created_at, updated_at)
      VALUES (
        ${user.id},
        ${user.name},
        ${user.email},
        ${user.avatar_url},
        ${user.role},
        ${user.password_hash},
        ${user.is_active},
        ${user.must_change_password},
        ${user.is_deleted || false},
        ${user.cover_url || null},
        ${user.cover_position ? JSON.stringify(user.cover_position) : null}::jsonb,
        NOW(),
        NOW()
      )
    `);
    console.log(`  - Usuario insertado: ${user.email}`);
  }
  await db.execute(sql`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);

  console.log('\nPaso 3: Insertando leads...');
  for (const lead of leadsData) {
    const servicioInteresArray = lead.servicio_interes 
      ? (Array.isArray(lead.servicio_interes) ? lead.servicio_interes : [lead.servicio_interes])
      : [];
    
    await db.execute(sql`
      INSERT INTO leads (
        id, etapa, assigned_user_id, is_converted,
        nombre_empresa, nombre_contacto, sector, ciudad, telefono, email, email_secundario, web, fuente_origen,
        servicio_interes, necesidad, fecha_envio_propuesta, valor_implementacion, valor_mensualidad,
        fecha_primer_contacto, comentarios, resultado_final, fecha_cierre_real,
        hitos, is_deleted, deleted_at, cover_url, cover_position, created_at, updated_at
      )
      VALUES (
        ${lead.id},
        ${lead.etapa},
        ${lead.assigned_user_id},
        ${lead.is_converted || false},
        ${lead.nombre_empresa},
        ${lead.nombre_contacto},
        ${lead.sector},
        ${lead.ciudad},
        ${lead.telefono},
        ${lead.email},
        ${lead.email_secundario},
        ${lead.web},
        ${lead.fuente_origen},
        ${JSON.stringify(servicioInteresArray)}::jsonb,
        ${lead.necesidad},
        ${lead.fecha_envio_propuesta},
        ${lead.valor_implementacion},
        ${lead.valor_mensualidad},
        ${lead.fecha_primer_contacto},
        ${lead.comentarios},
        ${lead.resultado_final},
        ${lead.fecha_cierre_real},
        ${lead.hitos ? JSON.stringify(lead.hitos) : null}::jsonb,
        ${lead.is_deleted || false},
        ${lead.deleted_at || null},
        ${lead.cover_url},
        ${lead.cover_position ? JSON.stringify(lead.cover_position) : null}::jsonb,
        NOW(),
        NOW()
      )
    `);
    console.log(`  - Lead insertado: ${lead.nombre_empresa} (ID: ${lead.id})`);
  }
  await db.execute(sql`SELECT setval('leads_id_seq', (SELECT MAX(id) FROM leads))`);

  console.log('\nPaso 4: Insertando clientes activos...');
  for (const client of activeClientsData) {
    await db.execute(sql`
      INSERT INTO active_clients (
        id, lead_id, estado_servicio, fecha_inicio_servicio, fecha_corte,
        pago_mes_actual, valor_mensual_servicio, is_deleted, deleted_at, cover_url, cover_position, created_at, updated_at
      )
      VALUES (
        ${client.id},
        ${client.lead_id},
        ${client.estado_servicio},
        ${client.fecha_inicio_servicio},
        ${client.fecha_corte},
        ${client.pago_mes_actual || false},
        ${client.valor_mensual_servicio},
        ${client.is_deleted || false},
        ${client.deleted_at || null},
        ${client.cover_url},
        ${client.cover_position ? JSON.stringify(client.cover_position) : null}::jsonb,
        NOW(),
        NOW()
      )
    `);
    console.log(`  - Cliente activo insertado: ID ${client.id}`);
  }
  await db.execute(sql`SELECT setval('active_clients_id_seq', (SELECT MAX(id) FROM active_clients))`);

  console.log('\nPaso 5: Insertando tareas...');
  for (const task of tasksData) {
    const assigneeIdsArray = task.assignee_id ? [task.assignee_id] : (task.assignee_ids || []);
    
    await db.execute(sql`
      INSERT INTO tasks (
        id, title, description, status, assignee_ids, client_name, priority, deadline,
        comments, subtasks, completed_at, is_deleted, deleted_at, cover_url, cover_position, created_at, updated_at
      )
      VALUES (
        ${task.id},
        ${task.title},
        ${task.description},
        ${task.status},
        ${JSON.stringify(assigneeIdsArray)}::jsonb,
        ${task.client_name},
        ${task.priority},
        ${task.deadline},
        ${task.comments},
        ${task.subtasks ? JSON.stringify(task.subtasks) : null}::jsonb,
        ${task.completed_at || null},
        ${task.is_deleted || false},
        ${task.deleted_at || null},
        ${task.cover_url},
        ${task.cover_position ? JSON.stringify(task.cover_position) : null}::jsonb,
        NOW(),
        NOW()
      )
    `);
    console.log(`  - Tarea insertada: ${task.title} (ID: ${task.id})`);
  }
  await db.execute(sql`SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks))`);

  console.log('\n=== VERIFICACIÓN FINAL ===');
  const usersCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
  const leadsCount = await db.execute(sql`SELECT COUNT(*) as count FROM leads`);
  const activeClientsCount = await db.execute(sql`SELECT COUNT(*) as count FROM active_clients`);
  const tasksCount = await db.execute(sql`SELECT COUNT(*) as count FROM tasks`);
  
  console.log(`Usuarios: ${usersCount.rows[0].count} (esperado: ${usersData.length})`);
  console.log(`Leads: ${leadsCount.rows[0].count} (esperado: ${leadsData.length})`);
  console.log(`Clientes Activos: ${activeClientsCount.rows[0].count} (esperado: ${activeClientsData.length})`);
  console.log(`Tareas: ${tasksCount.rows[0].count} (esperado: ${tasksData.length})`);
  
  const allMatch = 
    Number(usersCount.rows[0].count) === usersData.length &&
    Number(leadsCount.rows[0].count) === leadsData.length &&
    Number(activeClientsCount.rows[0].count) === activeClientsData.length &&
    Number(tasksCount.rows[0].count) === tasksData.length;
  
  if (allMatch) {
    console.log('\n✅ MIGRACIÓN EXITOSA - Todos los conteos coinciden');
  } else {
    console.log('\n❌ ERROR - Los conteos no coinciden');
  }
  
  process.exit(0);
}

migrateProductionData().catch(err => {
  console.error('Error durante la migración:', err);
  process.exit(1);
});
