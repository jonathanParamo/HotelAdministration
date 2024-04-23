import pool from "../pool-management.js";

export async function cleanRoomHistory() {
  try {
    const query = `
      SELECT r.room_id, r.end_date, MAX(c.cleaning_date) AS last_cleaning_date
      FROM reservations r
      LEFT JOIN cleaning_history c ON r.room_id = c.room_id
      GROUP BY r.room_id, r.end_date
      HAVING r.end_date <= CURRENT_DATE() AND (MAX(c.cleaning_date) IS NULL OR MAX(c.cleaning_date) < r.end_date)
      ORDER BY r.end_date DESC
      LIMIT 10;
    `;

    const [roomsNeedingCleaning] = await pool.query(query);

    if (!roomsNeedingCleaning || roomsNeedingCleaning.length === 0) {
      throw new Error('At this time, no rooms need cleaning.');
    };

    return roomsNeedingCleaning;
  } catch (error) {
    throw new Error(`Error getting room cleaning history: ${error.message}`);
  }
};