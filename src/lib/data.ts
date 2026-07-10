import { db } from './db';

export function getAgentByEmail(email: string) {
  return db.prepare('SELECT * FROM agents WHERE email = ?').get(email);
}

export function getAgentByCode(code: string) {
  return db.prepare('SELECT * FROM agents WHERE code = ?').get(code);
}

export function getAgentById(id: number) {
  return db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
}

export function updateAgentProfile(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE agents SET agency_name = ?, contact_person = ?, phone = ?, city = ?, country = ?
    WHERE id = ?
  `);
  stmt.run(data.agency_name, data.contact_person, data.phone, data.city, data.country, id);
}

export function getUmrahPackages(filters?: { airline?: string; from?: string; to?: string; agent_id?: number }) {
  let sql = "SELECT * FROM umrah_packages WHERE status = 'active'";
  const params: any[] = [];
  if (filters?.airline) { sql += ' AND airline = ?'; params.push(filters.airline); }
  if (filters?.from) { sql += ' AND departure_date >= ?'; params.push(filters.from); }
  if (filters?.to) { sql += ' AND departure_date <= ?'; params.push(filters.to); }
  if (filters?.agent_id !== undefined) { sql += ' AND agent_id = ?'; params.push(filters.agent_id); }
  sql += ' ORDER BY departure_date';
  return db.prepare(sql).all(...params);
}

export function getOneWayGroups() {
  return db.prepare("SELECT * FROM one_way_groups WHERE status = 'active' ORDER BY departure_date").all();
}

export function getUmrahGroups() {
  return db.prepare("SELECT * FROM umrah_groups WHERE status = 'active' ORDER BY departure_date").all();
}

export function getHotels(city?: string) {
  let sql = 'SELECT * FROM hotels';
  const params: any[] = [];
  if (city) { sql += ' WHERE city = ?'; params.push(city); }
  return db.prepare(sql).all(...params);
}

export function getHotelRates(hotelId?: number) {
  let sql = 'SELECT r.*, h.name as hotel_name, h.city, h.rating, h.address, h.distance FROM hotel_rates r JOIN hotels h ON r.hotel_id = h.id';
  const params: any[] = [];
  if (hotelId) { sql += ' WHERE r.hotel_id = ?'; params.push(hotelId); }
  return db.prepare(sql).all(...params);
}

export function getBookingsByAgent(agentId: number, type?: string) {
  let sql = 'SELECT * FROM bookings WHERE agent_id = ?';
  const params: any[] = [agentId];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY created_at DESC';
  return db.prepare(sql).all(...params);
}

export function createBooking(data: any) {
  const stmt = db.prepare(`
    INSERT INTO bookings (agent_id, type, reference_id, package_id, group_id, adults, infants, total_amount, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.agent_id, data.type, data.reference_id || randomRef(), data.package_id, data.group_id, data.adults, data.infants, data.total_amount, data.status || 'pending', data.notes);
}

export function createClientBooking(data: any) {
  const stmt = db.prepare(`
    INSERT INTO bookings (agent_id, type, reference_id, package_id, group_id, ticket_id, adults, infants, total_amount, status, room_type, client_name, client_phone, client_email, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.agent_id || null,
    data.type,
    data.reference_id || randomRef(),
    data.package_id || null,
    data.group_id || null,
    data.ticket_id || null,
    data.adults,
    data.infants,
    data.total_amount,
    data.status || 'pending',
    data.room_type || null,
    data.client_name,
    data.client_phone,
    data.client_email,
    data.notes || null
  );
}

export function getBankDetails(agentId: number) {
  return db.prepare('SELECT * FROM bank_details WHERE agent_id = ?').all(agentId);
}

export function createBankDetail(data: any) {
  const stmt = db.prepare(`
    INSERT INTO bank_details (agent_id, bank_name, account_title, account_number, iban, branch, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.agent_id, data.bank_name, data.account_title, data.account_number, data.iban, data.branch, data.is_default ? 1 : 0);
}

export function getLedger(agentId: number) {
  return db.prepare('SELECT * FROM ledger WHERE agent_id = ? ORDER BY date DESC').all(agentId);
}

export function getPayments(agentId: number) {
  return db.prepare('SELECT * FROM payments WHERE agent_id = ? ORDER BY date DESC').all(agentId);
}

export function createPayment(data: any) {
  const stmt = db.prepare(`
    INSERT INTO payments (agent_id, amount, method, status, reference, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.agent_id, data.amount, data.method, data.status || 'pending', data.reference, data.notes);
}

export function getDownloads() {
  return db.prepare('SELECT * FROM downloads ORDER BY created_at DESC').all();
}

export function createContact(data: any) {
  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(data.name, data.email, data.phone, data.subject, data.message);
}

function randomRef() {
  return 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}
