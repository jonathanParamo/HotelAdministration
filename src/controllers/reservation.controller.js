import { createReservationModel } from "../models/reservation.model.js"
import { sendReservation } from "../mails/reservation.mail.js";
import { createReservationPDF } from "../pdf/reservation.pdf.js";

export async function createReservationController(req, res) {
  const {
    reservation_id,
    user_id,
    room_id,
    start_date,
    end_date,
    status,
    room_number,
    email,
    name
  } = req.body;

  try {
    const createReservation = await createReservationModel({
      user_id,
      room_id,
      start_date,
      end_date,
      status,
      room_number
    });

    const pdfPath = createReservationPDF({
      reservation_id,
      room_number,
      name: name,
      start_date,
      end_date
    });

    await sendReservation(email, pdfPath);

    return res.status(201).json({ success: true, reservation: createReservation })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
};
