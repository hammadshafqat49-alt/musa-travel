import { db } from './db';

export function getDashboardStats() {
  const agents = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
  const packages = db.prepare('SELECT COUNT(*) as count FROM umrah_packages').get() as { count: number };
  const bookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get() as { count: number };
  const payments = db.prepare('SELECT COUNT(*) as count FROM payments').get() as { count: number };
  const tickets = db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number };
  const totalRevenue = db.prepare('SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings').get() as { total: number };
  const totalPaid = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = ?').get('approved') as { total: number };
  const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get() as { count: number };
  return {
    agents: agents.count,
    packages: packages.count,
    bookings: bookings.count,
    payments: payments.count,
    tickets: tickets.count,
    revenue: totalRevenue.total,
    totalPaid: totalPaid.total,
    contacts: contacts.count,
  };
}

export function getAllAgents() {
  return db.prepare('SELECT * FROM agents ORDER BY created_at DESC').all();
}

export function getAgentById(id: number) {
  return db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
}

export function createAgent(data: any) {
  const stmt = db.prepare(`
    INSERT INTO agents (code, email, password, agency_name, contact_person, phone, city, country, balance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.code, data.email, data.password, data.agency_name, data.contact_person, data.phone, data.city, data.country, data.balance || 0);
}

export function updateAgent(id: number, data: any) {
  if (data.password && data.password.trim() !== "") {
    const stmt = db.prepare(`
      UPDATE agents SET code = ?, email = ?, password = ?, agency_name = ?, contact_person = ?, phone = ?, city = ?, country = ?, balance = ?
      WHERE id = ?
    `);
    stmt.run(data.code, data.email, data.password, data.agency_name, data.contact_person, data.phone, data.city, data.country, data.balance, id);
  } else {
    const stmt = db.prepare(`
      UPDATE agents SET code = ?, email = ?, agency_name = ?, contact_person = ?, phone = ?, city = ?, country = ?, balance = ?
      WHERE id = ?
    `);
    stmt.run(data.code, data.email, data.agency_name, data.contact_person, data.phone, data.city, data.country, data.balance, id);
  }
}

export function deleteAgent(id: number) {
  return db.prepare('DELETE FROM agents WHERE id = ?').run(id);
}

export function getAllUmrahPackages() {
  return db.prepare(`
    SELECT p.*, a.agency_name as agent_name
    FROM umrah_packages p
    LEFT JOIN agents a ON p.agent_id = a.id
    ORDER BY p.departure_date DESC
  `).all();
}

export function createUmrahPackage(data: any) {
  const stmt = db.prepare(`
    INSERT INTO umrah_packages (title, airline, departure_date, return_date, days, price, visa_price, hotel_makkah, hotel_madina, status, image_url, sharing_price, double_price, triple_price, quad_price, quint_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.title, data.airline, data.departure_date, data.return_date, data.days, data.price, data.visa_price || 0, data.hotel_makkah, data.hotel_madina, data.status || 'active', data.image_url || '', data.sharing_price || 0, data.double_price || 0, data.triple_price || 0, data.quad_price || 0, data.quint_price || 0);
}

export function updateUmrahPackage(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE umrah_packages SET title = ?, airline = ?, departure_date = ?, return_date = ?, days = ?, price = ?, visa_price = ?, hotel_makkah = ?, hotel_madina = ?, status = ?, image_url = ?, sharing_price = ?, double_price = ?, triple_price = ?, quad_price = ?, quint_price = ?
    WHERE id = ?
  `);
  stmt.run(data.title, data.airline, data.departure_date, data.return_date, data.days, data.price, data.visa_price, data.hotel_makkah, data.hotel_madina, data.status, data.image_url || '', data.sharing_price || 0, data.double_price || 0, data.triple_price || 0, data.quad_price || 0, data.quint_price || 0, id);
}

export function deleteUmrahPackage(id: number) {
  return db.prepare('DELETE FROM umrah_packages WHERE id = ?').run(id);
}

export function getAllOneWayGroups() {
  return db.prepare('SELECT * FROM one_way_groups ORDER BY departure_date DESC').all();
}

export function createOneWayGroup(data: any) {
  const stmt = db.prepare(`
    INSERT INTO one_way_groups (title, destination, departure_date, return_date, airline, price, seats, available_seats, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.title, data.destination, data.departure_date, data.return_date, data.airline, data.price, data.seats, data.available_seats, data.status || 'active');
}

export function updateOneWayGroup(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE one_way_groups SET title = ?, destination = ?, departure_date = ?, return_date = ?, airline = ?, price = ?, seats = ?, available_seats = ?, status = ?
    WHERE id = ?
  `);
  stmt.run(data.title, data.destination, data.departure_date, data.return_date, data.airline, data.price, data.seats, data.available_seats, data.status, id);
}

export function deleteOneWayGroup(id: number) {
  return db.prepare('DELETE FROM one_way_groups WHERE id = ?').run(id);
}

export function getAllUmrahGroups() {
  return db.prepare('SELECT * FROM umrah_groups ORDER BY departure_date DESC').all();
}

export function createUmrahGroup(data: any) {
  const stmt = db.prepare(`
    INSERT INTO umrah_groups (title, departure_date, return_date, airline, price, days, seats, available_seats, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.title, data.departure_date, data.return_date, data.airline, data.price, data.days, data.seats, data.available_seats, data.status || 'active');
}

export function updateUmrahGroup(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE umrah_groups SET title = ?, departure_date = ?, return_date = ?, airline = ?, price = ?, days = ?, seats = ?, available_seats = ?, status = ?
    WHERE id = ?
  `);
  stmt.run(data.title, data.departure_date, data.return_date, data.airline, data.price, data.days, data.seats, data.available_seats, data.status, id);
}

export function deleteUmrahGroup(id: number) {
  return db.prepare('DELETE FROM umrah_groups WHERE id = ?').run(id);
}

export function getAllHotels() {
  return db.prepare('SELECT * FROM hotels ORDER BY created_at DESC').all();
}

export function createHotel(data: any) {
  const stmt = db.prepare(`
    INSERT INTO hotels (name, city, rating, address, distance)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(data.name, data.city, data.rating, data.address, data.distance);
}

export function updateHotel(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE hotels SET name = ?, city = ?, rating = ?, address = ?, distance = ?
    WHERE id = ?
  `);
  stmt.run(data.name, data.city, data.rating, data.address, data.distance, id);
}

export function deleteHotel(id: number) {
  return db.prepare('DELETE FROM hotels WHERE id = ?').run(id);
}

export function getAllHotelRates() {
  return db.prepare('SELECT r.*, h.name as hotel_name, h.city FROM hotel_rates r JOIN hotels h ON r.hotel_id = h.id ORDER BY r.id DESC').all();
}

export function createHotelRate(data: any) {
  const stmt = db.prepare(`
    INSERT INTO hotel_rates (hotel_id, date_from, date_to, sharing_price, double_price, triple_price, quad_price, quint_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.hotel_id, data.date_from, data.date_to, data.sharing_price, data.double_price, data.triple_price, data.quad_price, data.quint_price);
}

export function updateHotelRate(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE hotel_rates SET hotel_id = ?, date_from = ?, date_to = ?, sharing_price = ?, double_price = ?, triple_price = ?, quad_price = ?, quint_price = ?
    WHERE id = ?
  `);
  stmt.run(data.hotel_id, data.date_from, data.date_to, data.sharing_price, data.double_price, data.triple_price, data.quad_price, data.quint_price, id);
}

export function deleteHotelRate(id: number) {
  return db.prepare('DELETE FROM hotel_rates WHERE id = ?').run(id);
}

export function getAllBookings() {
  return db.prepare(`
    SELECT b.*, COALESCE(a.agency_name, 'Direct Client') as agent_name
    FROM bookings b
    LEFT JOIN agents a ON b.agent_id = a.id
    ORDER BY b.created_at DESC
  `).all();
}

export function getAllBookingsWithDetails() {
  return db.prepare(`
    SELECT
      b.id,
      b.agent_id,
      COALESCE(a.agency_name, 'Direct Client') as agent_name,
      a.email as agent_email,
      a.phone as agent_phone,
      b.type,
      b.reference_id,
      b.adults,
      b.infants,
      b.total_amount,
      b.status,
      b.room_type,
      b.notes,
      b.client_name,
      b.client_phone,
      b.client_email,
      b.created_at,
      p.id as package_id,
      p.title as package_title,
      p.airline as package_airline,
      p.departure_date as package_departure,
      p.return_date as package_return,
      p.days as package_days,
      p.price as package_price,
      p.visa_price as package_visa_price,
      p.hotel_makkah,
      p.hotel_madina,
      p.transport_included,
      p.image_url,
      p.sharing_price,
      p.double_price,
      p.triple_price,
      p.quad_price,
      p.quint_price,
      owg.id as ow_group_id,
      owg.title as ow_group_title,
      owg.destination as ow_group_destination,
      owg.airline as ow_group_airline,
      owg.departure_date as ow_group_departure,
      owg.price as ow_group_price,
      owg.seats as ow_group_seats,
      ug.id as umrah_group_id,
      ug.title as umrah_group_title,
      ug.airline as umrah_group_airline,
      ug.departure_date as umrah_group_departure,
      ug.return_date as umrah_group_return,
      ug.price as umrah_group_price,
      ug.days as umrah_group_days
    FROM bookings b
    LEFT JOIN agents a ON b.agent_id = a.id
    LEFT JOIN umrah_packages p ON b.package_id = p.id
    LEFT JOIN one_way_groups owg ON b.group_id = owg.id AND b.type = 'group'
    LEFT JOIN umrah_groups ug ON b.group_id = ug.id AND b.type = 'umrah'
    ORDER BY b.created_at DESC
  `).all();
}

export function updateBookingStatus(id: number, status: string) {
  return db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
}

export function deleteBooking(id: number) {
  return db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
}

export function getAllPayments() {
  return db.prepare(`
    SELECT p.*, a.agency_name as agent_name
    FROM payments p
    JOIN agents a ON p.agent_id = a.id
    ORDER BY p.date DESC
  `).all();
}

export function updatePaymentStatus(id: number, status: string) {
  return db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, id);
}

export function deletePayment(id: number) {
  return db.prepare('DELETE FROM payments WHERE id = ?').run(id);
}

export function getAllContacts() {
  return db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
}

export function deleteContact(id: number) {
  return db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
}

export function getAllDownloadsAdmin() {
  return db.prepare('SELECT * FROM downloads ORDER BY created_at DESC').all();
}

export function createDownload(data: any) {
  const stmt = db.prepare(`
    INSERT INTO downloads (title, file_url, category)
    VALUES (?, ?, ?)
  `);
  return stmt.run(data.title, data.file_url, data.category);
}

export function updateDownload(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE downloads SET title = ?, file_url = ?, category = ?
    WHERE id = ?
  `);
  stmt.run(data.title, data.file_url, data.category, id);
}

export function deleteDownload(id: number) {
  return db.prepare('DELETE FROM downloads WHERE id = ?').run(id);
}

export function getAllLedgerAdmin() {
  return db.prepare(`
    SELECT l.*, a.agency_name as agent_name
    FROM ledger l
    JOIN agents a ON l.agent_id = a.id
    ORDER BY l.date DESC
  `).all();
}

export function deleteLedgerEntry(id: number) {
  return db.prepare('DELETE FROM ledger WHERE id = ?').run(id);
}

export function getAllTickets() {
  return db.prepare('SELECT * FROM tickets ORDER BY departure_date DESC').all();
}

export function createTicket(data: any) {
  const stmt = db.prepare(`
    INSERT INTO tickets (airline, flight_no, from_city, to_city, departure_date, departure_time, return_date, return_time, class, ticket_type, price, seats, available_seats, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.airline,
    data.flight_no,
    data.from_city,
    data.to_city,
    data.departure_date,
    data.departure_time || null,
    data.return_date || null,
    data.return_time || null,
    data.class || 'economy',
    data.ticket_type || 'oneway',
    data.price,
    data.seats || 0,
    data.available_seats || data.seats || 0,
    data.status || 'active',
    data.notes || ''
  );
}

export function updateTicket(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE tickets SET airline = ?, flight_no = ?, from_city = ?, to_city = ?, departure_date = ?, departure_time = ?, return_date = ?, return_time = ?, class = ?, ticket_type = ?, price = ?, seats = ?, available_seats = ?, status = ?, notes = ?
    WHERE id = ?
  `);
  stmt.run(
    data.airline,
    data.flight_no,
    data.from_city,
    data.to_city,
    data.departure_date,
    data.departure_time || null,
    data.return_date || null,
    data.return_time || null,
    data.class || 'economy',
    data.ticket_type || 'oneway',
    data.price,
    data.seats || 0,
    data.available_seats ?? data.seats ?? 0,
    data.status || 'active',
    data.notes || '',
    id
  );
}

export function deleteTicket(id: number) {
  return db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
}
