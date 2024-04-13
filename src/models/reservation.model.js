import pool from "../pool-management.js";
import { checkReservations } from "../task/reservations.task.js";

export async function createReservationModel({
  user_id,
  room_id,
  start_date,
  end_date,
  status,
  room_number
}) {
  try {
    const [existingRoom] = await pool.query('SELECT * FROM rooms WHERE room_number = ?', room_number);

    if (!existingRoom || existingRoom.length === 0) {
      throw new Error('This room does not exist');
    }

    if (existingRoom[0].status !== 'available') {
      throw new Error('This room is not available for the reservation at this moment');
    }

    const queryIsAvailable = 'SELECT * FROM reservations WHERE room_id = ? AND (? BETWEEN start_date AND end_date OR ? BETWEEN start_date AND end_date)';
    const [existingReservations] = await pool.query(queryIsAvailable, [room_id, start_date, end_date]);
    if (existingReservations.length > 0) {
      throw new Error('The room is not available for the selected dates.');
    }

    const query = 'INSERT INTO reservations (user_id, room_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [user_id, room_id, start_date, end_date, status];
    const [result] = await pool.query(query, values);

    await checkReservations();

    if (result.affectedRows === 1) {
      const reservation_id = result.insertId;
      const createReservation = {
        reservation_id,
        user_id,
        room_id,
        start_date,
        end_date,
        status,
        room_number,
      };

      return createReservation;
    } else {
      throw new Error('Failed to create reservation.');
    }
  } catch (error) {
    throw new Error(`Error in creating the reservation: ${error.message}`);
  }
};
