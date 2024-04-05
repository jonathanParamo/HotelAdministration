import { createRoomModel } from "../models/room.model.js";

export async function createRoomController(req, res) {
  const {
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
  } = req.body;

  try {
    const createdRoom = await createRoomModel({
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
    });

    return res.status(201).json({ success: true, room: createdRoom });
  } catch (error) {

    return res.status(500).json({ error: 'Internal server error' });
  }
};
