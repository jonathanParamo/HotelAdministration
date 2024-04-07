import {
  createRoomModel,
  editRoomModel,
  deleteRoomModel
} from "../models/room.model.js";

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

    return res.status(500).json({ error: error.message });
  }
};

export async function editRoomController(req, res) {
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
    const editRoom = await editRoomModel({
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

    return res.status(201).json({ success: true, room: editRoom });
  } catch (error) {

    return res.status(500).json({ error: error.message });
  }
};

export async function deleteRoomController(req, res) {
  const { room_number } = req.body;

  try {
    if(!room_number) {
      throw new Error('Room number has not been provided')
    }

    const result = await deleteRoomModel(room_number);

    res.status(201).json({ success: true, result })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
