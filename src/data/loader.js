// ═══════════════════════════════════════════════════════════════
// DATA LOADER — PapaParse all 8 CSVs
// ═══════════════════════════════════════════════════════════════

export const SCHEMA = {
  flights: {
    flight_id: '0', airline: '1', airline_code: '2',
    origin: '3', destination: '4',
    sched_dep: '5', actual_dep: '6',
    sched_arr: '7', actual_arr: '8',
    aircraft_type: '9', tail_number: '10',
    capacity: '11', pax_count: '12',
    status: '13', delay_mins: '14', delay_reason: '15',
    terminal: '16', gate: '17', is_international: '18',
    distance_km: '19', fuel_kg: '20', pushback_time: '21',
    on_time: '22', weather: '23', load_factor: '24',
    bag_count: '25', on_time_ratio: '26',
    time_of_day: '27', day_of_week: '28',
    is_holiday: '29', season: '30', flight_type: '31'
  },
  passengers: {
    passenger_id: '0', ticket_no: '1', pnr_code: '2',
    first_name: '3', last_name: '4', nationality: '5',
    dob: '6', gender: '7', seat: '8', booking_class: '9',
    flight_id: '10', checkin_time: '11', boarding_time: '12',
    gate: '13', bag_count: '14',
    email: '18', phone: '19',
    is_vip: '22', wait_time_hrs: '23',
    special_assistance: '24', booked_class: '25',
    age: '26', age_group: '27'
  },
  baggage: {
    tag_id: '0', bag_id: '1', flight_id: '2', pnr_code: '3',
    weight_kg: '4', dimensions: '5', check_type: '6',
    belt: '7', scan_time: '8', checkin_time: '9',
    carousel: '10', status: '11', mishandled: '12',
    claim_count: '13', area: '14'
  },
  gate_events: {
    event_id: '0', flight_id: '1', gate: '2', terminal: '3',
    event_type: '4', event_time: '5', staff_id: '6',
    duration_mins: '7', priority: '8', delayed: '9'
  },
  security_screening: {
    screening_id: '0', pnr_code: '1', queue_id: '2',
    lane: '3', scan_time: '4', entry_time: '5', exit_time: '6',
    result: '7', flagged: '9', staff_id: '10',
    scanner_id: '11', wait_secs: '12',
    secondary_check: '13', shift_id: '15',
    throughput_per_hr: '16', staff_count: '17', queue_length: '18'
  },
  maintenance_logs: {
    work_order: '0', tail_number: '1', flight_id: '2',
    work_type: '3', team_id: '4',
    start_time: '5', end_time: '6',
    duration_hrs: '7', work_order_num: '8',
    defect_type: '9', fix_type: '10', severity: '11',
    tech_id: '12', resolved: '13'
  },
  staff_shifts: {
    staff_id: '0', name: '1', dept: '2', role: '3',
    shift_date: '4', shift_start: '5', shift_end: '6',
    terminal: '7', gate: '8', assigned_id: '9',
    hours: '10', overtime: '11', language: '14'
  },
  retail_transactions: {
    txn_id: '0', staff_id: '1', shop_name: '2', shop_type: '3',
    pnr_code: '4', flight_id: '5', txn_time: '6',
    item: '7', quantity: '8', unit_price: '9',
    total_amount: '10', payment_method: '11',
    currency: '12', terminal: '14', location: '15', is_airside: '16'
  }
}

const CSV_FILES = [
  { key: 'flights',              file: 'flights.csv' },
  { key: 'passengers',           file: 'passengers.csv' },
  { key: 'baggage',              file: 'baggage.csv' },
  { key: 'gate_events',          file: 'gate_events.csv' },
  { key: 'security_screening',   file: 'security_screening.csv' },
  { key: 'maintenance_logs',     file: 'maintenance_logs.csv' },
  { key: 'staff_shifts',         file: 'staff_shifts.csv' },
  { key: 'retail_transactions',  file: 'retail_transactions.csv' },
]

/**
 * Load all CSVs with progress callbacks.
 * @param {Function} onProgress (key, pct) called as each file loads
 * @returns {Object} raw dataset keyed by table name
 */
export async function loadAllData(onProgress) {
  const result = {}
  for (const { key, file } of CSV_FILES) {
    onProgress?.(key, 0)
    const data = await loadCSV(`/data/${file}`)
    result[key] = data
    onProgress?.(key, 100)
  }
  return result
}

function loadCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => resolve(data),
      error: reject
    })
  })
}

/**
 * Map a raw row through the schema to get named fields.
 * Returns an object with semantic field names.
 */
export function mapRow(tableName, row) {
  const schema = SCHEMA[tableName]
  if (!schema) return row
  const out = {}
  for (const [field, col] of Object.entries(schema)) {
    out[field] = row[col] ?? null
  }
  return out
}

/** Map all rows in a table */
export function mapTable(tableName, rows) {
  return rows.map(r => mapRow(tableName, r))
}
