import cron from 'node-cron';
import pool from "../pool-management.js";

async function completeReservations() {
  try {
    // Update reservations to 'completed'
    const updateQuery = `
      UPDATE reservations
      SET status = 'completed'
      WHERE end_date < NOW() AND status = 'active';
    `;
    const [updateResult] = await pool.query(updateQuery);

    const affectedReservations = updateResult.affectedRows;
    console.log(`Updated ${affectedReservations} reservations to completed.`);

    if (affectedReservations > 0) {
      const selectQuery = `
        SELECT room_id, user_id, NULL AS cleaning_user_id, NOW() AS cleaning_date, 'Automatically marked as completed' AS notes, 'completed' AS cleaning_status, NULL AS start_cleaning_date, NULL AS end_cleaning_date
        FROM reservations
        WHERE end_date < NOW() AND status = 'completed';
      `;
      const [insertResult] = await pool.query(selectQuery);

      if (insertResult && insertResult.length > 0) {
        const insertQuery = 'INSERT INTO cleaning_history (room_id, user_id, cleaning_user_id, cleaning_date, notes, cleaning_status, start_cleaning_date, end_cleaning_date) VALUES ?';
        const values = insertResult.map(reservation => [reservation.room_id, reservation.user_id, reservation.cleaning_user_id, reservation.cleaning_date, reservation.notes, reservation.cleaning_status, reservation.start_cleaning_date, reservation.end_cleaning_date]);

        await pool.query(insertQuery, [values]);
        console.log(`Inserted cleaning history records for ${affectedReservations} completed reservations.`);
      }
    }

    return `Updated ${affectedReservations} reservations to completed.`;
  } catch (error) {
    throw new Error('Error updating reservations to completed:', error.message);
  }
}

cron.schedule('0 */1 * * *', async () => {
  console.log('Updating reservations to completed status...');
  const updateResponse = await completeReservations();
  console.log(updateResponse);
});
