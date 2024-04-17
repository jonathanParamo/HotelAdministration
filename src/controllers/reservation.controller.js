import {
  createReservationModel,
  editReservationModel,
  cancelReservationModel
} from "../models/reservation.model.js"
import { sendReservation } from "../mails/reservation.mail.js";
import { createReservationPDF } from "../pdf/reservation.pdf.js";
import { sendCancellationEmail } from "../mails/cancellation.mail.js";

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

export async function editReservationController(req, res) {
  try {
    const {
      user_id,
      room_id,
      start_date,
      end_date,
      status,
      room_number,
      email,
      name,
      reservation_id
    } = req.body;

    const editReservation = await editReservationModel({
      user_id,
      room_id,
      start_date,
      end_date,
      status,
      room_number,
      reservation_id
    });

    if (editReservation) {
      const pdfBuffer = await createReservationPDF({
        reservation_id: editReservation.reservation_id,
        room_number: editReservation.room_number,
        name,
        start_date: editReservation.start_date,
        end_date: editReservation.end_date
      });
      return pdfBuffer;
    }

    await sendReservation(email, pdfBuffer);

    res.set('Content-Disposition', 'attachment; filename="reservation.pdf"');
    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export async function cancelReservationController(req, res) {
  try {
    const {
      email,
      reservation_id
    } = req.body;

    const cancelReservation = await cancelReservationModel({
      reservation_id
    });

    await sendCancellationEmail(email);

    res.status(200).send(cancelReservation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
