import pool from "../pool-management.js";
import cron from 'node-cron';

async function activateReservations(reservations) {
  const responses = [];
  for (const reservation of reservations) {
    try {
      const updateQuery = 'UPDATE reservations SET status = ? WHERE reservation_id = ?';
      const updateValues = ['active', reservation.reservation_id];
      await pool.query(updateQuery, updateValues);

      responses.push(`Reservation ${reservation.reservation_id} activated.`);
    } catch (error) {

      responses.push(`Error activating reservation ${reservation.reservation_id}: ${error.message}`);
    }
  }

  return responses;
};

export async function checkReservations() {
  try {
    const query = "SELECT * FROM reservations WHERE start_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)";
    const [results] = await pool.query(query);

    const activationResponses = await activateReservations(results);
    console.log('Activation responses:', activationResponses);
  } catch (error) {
    throw new Error('Error executing query:', error);
  }
}

cron.schedule('*/30 * * * *', async () => {
  console.log('Executing scheduled task...');
  const activationResponses = await checkReservations();
  console.log('Activation responses:', activationResponses);
});
