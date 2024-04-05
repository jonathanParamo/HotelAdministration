import pool from "../pool-management.js";

export async function createRoomModel({
  room_number,
  max_occupancy,
  number_of_beds,
  status,
  price_per_night,
  price_per_hour,
  room_photo1,
  room_photo2,
  room_photo3,
  room_photo4,
}) {
  try {
    const [existingRoom] = await pool.query('SELECT * FROM rooms WHERE room_number = ?', room_number);

    if (existingRoom.length > 0) {
      throw new Error('Room with this number already exists.');
    }

    const query = 'INSERT INTO rooms (room_number, max_occupancy, number_of_beds, status, price_per_night, price_per_hour room_photo1, room_photo2, room_photo3, room_photo4,) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [room_number, max_occupancy, number_of_beds, status, price_per_night, price_per_hour, room_photo1, room_photo2, room_photo3, room_photo4,];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 1) {
      const createdRoom = {
        room_number,
        max_occupancy,
        number_of_beds,
        status,
        price_per_night,
        price_per_hour,
        room_photo1,
        room_photo2,
        room_photo3,
        room_photo4
      };
      return createdRoom;
    } else {
      throw new Error('Failed to create room.');
    }
  } catch (error) {
    throw error;
  }
};

export async function editRoomModel({
  room_number,
  max_occupancy,
  number_of_beds,
  status,
  price_per_night,
  price_per_hour,
  room_photo1,
  room_photo2,
  room_photo3,
  room_photo4,
}) {
  const [existingRooms] = await pool.query('SELECT * FROM rooms WHERE room_number = ?', [room_number]);

  if (existingRooms.length === 0) {
    throw new Error('Room with this number does not exist.');
  }

  const query = `
    UPDATE rooms
    SET max_occupancy = ?, number_of_beds = ?, status = ?, price_per_night = ?, price_per_hour = ?, room_photo1 = ?, room_photo2 = ?, room_photo3 = ?, room_photo4 = ?
    WHERE room_number = ?`;

  const values = [max_occupancy, number_of_beds, status, price_per_night, price_per_hour, room_photo1, room_photo2, room_photo3, room_photo4, room_number];

  const [result] = await pool.query(query, values);

  if (result.affectedRows === 0) {
    throw new Error('Failed to update the room.');
  }

  const updatedRoom = {
    room_number,
    max_occupancy,
    number_of_beds,
    status,
    price_per_night,
    price_per_hour,
    room_photo1,
    room_photo2,
    room_photo3,
    room_photo4,
  };

  return updatedRoom;
}
