import pool from "../pool-management.js";

export async function getRoomsRequiringCleaning() {
  try {
    const query = 'SELECT * from cleaning_history';

    const [roomsNeedingCleaning] = await pool.query(query);

    if (!roomsNeedingCleaning || roomsNeedingCleaning.length === 0) {
      return 'At this time, no rooms need cleaning.';
    };

    return roomsNeedingCleaning;
  } catch (error) {
    throw new Error(`Error retrieving rooms requiring cleaning: ${error.message}`);
  }
};

export async function markRoomInCleaningProcess(roomId, cleaningUserId) {
  try {
    const updateRoomQuery = 'UPDATE rooms SET status = ? WHERE room_id = ?';
    const updateRoomValues = ['cleaning_required', roomId];
    await pool.query(updateRoomQuery, updateRoomValues);

    const insertCleaningHistoryQuery = `
      INSERT INTO cleaning_history (room_id, cleaning_user_id, cleaning_date, notes, cleaning_status, start_cleaning_date, end_cleaning_date)
      VALUES (?, ?, NOW(), 'Cleaning in progress', 'in_progress', NOW(), NULL)
    `;
    const insertCleaningHistoryValues = [roomId, cleaningUserId];
    await pool.query(insertCleaningHistoryQuery, insertCleaningHistoryValues);

    return `Room ${roomId} marked as cleaning in progress.`;
  } catch (error) {
    throw new Error(`Error marking room ${roomId} as cleaning in progress: ${error.message}`);
  }
}


export async function activateRoomAfterCleaning(roomId) {
  try {
    const updateRoomQuery = 'UPDATE rooms SET status = ? WHERE room_id = ?';
    const updateRoomValues = ['available', roomId];
    await pool.query(updateRoomQuery, updateRoomValues);

    const updateCleaningHistoryQuery = `
      UPDATE cleaning_history
      SET cleaning_status = 'completed', end_cleaning_date = NOW()
      WHERE room_id = ? AND cleaning_status = 'in_progress'
    `;
    await pool.query(updateCleaningHistoryQuery, [roomId]);

    return `Room ${roomId} activated after cleaning.`;
  } catch (error) {
    throw new Error(`Error activating room ${roomId} after cleaning: ${error.message}`);
  }
};
