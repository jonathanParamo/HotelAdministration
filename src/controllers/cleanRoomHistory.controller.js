import { cleanRoomHistory } from "../models/cleanRoomHistory.model.js";

export async function cleanRoomController(req, res) {
  try {
    const result = await cleanRoomHistory()

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
};