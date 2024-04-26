import cron from 'node-cron';
import pool from "../pool-management.js";

async function markRoomForCleaning(roomId) {
  try {
    const updateRoomQuery = 'UPDATE rooms SET status = ? WHERE room_id = ?';
    const updateRoomValues = ['cleaning_required', roomId];
    await pool.query(updateRoomQuery, updateRoomValues);
    return `Room ${roomId} marked for cleaning.`;
  } catch (error) {
    return `Error marking room ${roomId} for cleaning: ${error.message}`;
  }
};

async function checkReservationsForCleaning() {
  try {
    const query = "SELECT * FROM reservations INNER JOIN rooms ON reservations.room_id = rooms.room_id WHERE reservations.end_time < NOW() AND rooms.status != 'cleaning_required'";
    const [results] = await pool.query(query);

    const cleaningResponses = [];
    for (const reservation of results) {
      const response = await markRoomForCleaning(reservation.room_id);
      cleaningResponses.push(response);
    }

    return cleaningResponses;
  } catch (error) {
    throw new Error('Error checking reservations for cleaning:', error);
  }
};

cron.schedule('0 * * * *', async () => {
  console.log('Checking rooms to mark for cleaning...');
  const cleaningResponses = await checkReservationsForCleaning();
  console.log('Cleaning responses:', cleaningResponses);
});
