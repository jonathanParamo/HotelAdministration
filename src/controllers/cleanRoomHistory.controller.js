import {
  getRoomsRequiringCleaning,
  markRoomInCleaningProcess,
  activateRoomAfterCleaning
} from "../models/cleanRoomHistory.model.js";

export async function cleanRoomController(req, res) {
  try {
    const result = await getRoomsRequiringCleaning()

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
};

export async function cleanRoomInProcessController(req, res) {
  try {
    const { room_id, cleaningUserId } = req.body
    const result = await markRoomInCleaningProcess( room_id, cleaningUserId )

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
};

export async function activeRoomAfterCleaningController(req, res) {
  try {
    const { room_id } = req.body;

    const result = await activateRoomAfterCleaning(room_id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
