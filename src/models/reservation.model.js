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

export async function editReservationModel({
  user_id,
  room_id,
  start_date,
  end_date,
  status,
  room_number,
  reservation_id
}) {
  try {
    // Check if the room exists
    const [existingRoom] = await pool.query('SELECT * FROM rooms WHERE room_id = ?', room_id);
    if (!existingRoom || existingRoom.length === 0) {
      throw new Error('This room does not exist');
    }

    // Check if the room is available for the new dates
    const queryIsAvailable = 'SELECT * FROM reservations WHERE reservation_id = ?';
    const [existingReservation] = await pool.query(queryIsAvailable, [reservation_id]);

    if (!existingReservation || existingReservation.length === 0) {
      throw new Error('This reservation does not exits');
    }

    // Query to check overlaps excluding the current reservation
    const overlapQuery = 'SELECT * FROM reservations WHERE room_id = ? AND reservation_id != ? AND (? BETWEEN start_date AND end_date OR ? BETWEEN start_date AND end_date)';
    const [overlappingReservations] = await pool.query(overlapQuery, [room_id, reservation_id, start_date, end_date]);

    // If there are other reservations overlapping with the new dates, and they are not the reservation we are updating
    if (overlappingReservations.length === 1 && !overlappingReservations.some(reservation => reservation.reservation_id === reservation_id)) {
      throw new Error('The new dates overlap with another existing reservation.');
    }

    // Update the reservation with the new dates
    const query = 'UPDATE reservations SET start_date = ?, end_date = ?, status = ? WHERE reservation_id = ?';
    const values = [start_date, end_date, status, reservation_id];
    const [result] = await pool.query(query, values);

    // Check if the update was successful
    if (result.affectedRows === 1) {
      const updatedReservation = {
        reservation_id,
        user_id,
        room_id,
        start_date,
        end_date,
        status,
        room_number,
      };

      return updatedReservation;
    } else {
      throw new Error('Failed to update reservation.');
    }
  } catch (error) {
    throw new Error(`Error in updating the reservation: ${error.message}`);
  }
};

export async function cancelReservationModel({ reservation_id }) {
  try {
    if (!reservation_id) throw new Error('Your reservation number has not provide');

    const [existingReservation] = await pool.query('SELECT * FROM reservations WHERE reservation_id = ?', reservation_id);

    if (existingReservation.length === 0) {
      throw new Error('Your reservation number is not valid');
    }

    const room_id = existingReservation[0].room_id;

    // Delete the reservation
    const deleteResult = await pool.query('DELETE FROM reservations WHERE reservation_id = ?', reservation_id);
    if (deleteResult.affectedRows === 0) {
      throw new Error('Failed to cancel reservation');
    }

    // Update the room status to set it as 'available'
    const updateRoomResult = await pool.query('UPDATE rooms SET status = ? WHERE room_id = ?', ['available', room_id]);
    if (updateRoomResult.affectedRows === 0) {
      throw new Error('Failed to update room status');
    }

    return { message: 'Reservation cancelled and room status updated successfully.' };
  } catch (error) {
    throw new Error(`Error in cancelling the reservation: ${error.message}`);
  }
};
