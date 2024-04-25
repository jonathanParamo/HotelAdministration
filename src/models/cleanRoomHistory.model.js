import pool from "../pool-management.js";

export async function getRoomsRequiringCleaning() {
  try {
    const query = `
      SELECT room_id, room_number, max_occupancy, number_of_beds, price_per_night, price_per_hour
      FROM rooms
      WHERE status = 'cleaning_required'
      ORDER BY room_id;
    `;

    const [roomsNeedingCleaning] = await pool.query(query);

    if (!roomsNeedingCleaning || roomsNeedingCleaning.length === 0) {
      return 'At this time, no rooms need cleaning.';
    };

    return roomsNeedingCleaning;
  } catch (error) {
    throw new Error(`Error retrieving rooms requiring cleaning: ${error.message}`);
  }
};
