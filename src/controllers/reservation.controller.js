import { createReservationModel } from "../models/reservation.model.js"
import { sendReservation } from "../mails/reservation.mail.js";
import { createReservationPDF } from "../pdf/reservation.pdf.js";

export async function createReservationController(req, res) {
  const {
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

    const { reservation_id } = createReservation;

    const pdfBuffer = await createReservationPDF({
      reservation_id,
      room_number,
      name: name,
      start_date,
      end_date
    });

    await sendReservation(email, pdfBuffer);

    res.set('Content-Disposition', 'attachment; filename="reservation.pdf"');
    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
};
