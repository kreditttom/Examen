import * as SQLite from "expo-sqlite";

export const openDatabase = async () => { return await SQLite.openDatabaseAsync('violations.db'); }

export const createTable = async () => {
    const database = await openDatabase();
    try {
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            create table if not exists violations(
                id integer primary key autoincrement,
                description text not null,
                image blob,
                date text not null,
                userId text not null,
                latitude real,
                longitude real,
                synced integer default 0
            );
        `);
        console.log('Table created')
    } catch (error) { console.error("Error creating table:", error) }
}

export const insertViolation = async (description, image, date, userId, latitude, longitude) => {
    if (!description || !date || !userId) { return null; }
    const database = await openDatabase();
    try {
        const result = await database.runAsync(
            'insert into violations (description, image, date, userId, latitude, longitude) values (?, ?, ?, ?, ?, ?)',
            description, image, date, userId, latitude, longitude
        );
        console.log('Violation inserted with id:', result.lastInsertRowId);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error insert violation:', error);
        return null;
    }
}

export const fetchViolationsByDate = async (date) => {
    const database = await openDatabase();
    try {
        const allRows = await database.getAllAsync(
            'select * from violations where date = ? order by id',
            date
        );
        console.log('All Violations:', allRows);
        return allRows;
    } catch (error) {
        console.error('Error fetching violations:', error)
        return [];
    }
};

export const fetchViolationDates = async (fromDate, toDate) => {
    const database = await openDatabase();
    try {
        const rows = await database.getAllAsync(
            'select distinct date from violations where date >= ? and date <= ?',
            fromDate, toDate
        );
        return rows.map((row) => row.date);
    } catch (error) {
        console.error('Error fetching violation dates:', error)
        return [];
    }
};

export const fetchUnsyncedViolations = async () => {
    const database = await openDatabase();
    try {
        return await database.getAllAsync('select * from violations where synced = 0');
    } catch (error) {
        console.error('Error fetching unsynced violations:', error)
        return [];
    }
};

export const markAsSynced = async (id) => {
    if (!id) { return; }
    const database = await openDatabase();
    try {
        await database.runAsync('update violations set synced = 1 where id = ?', id);
        console.log('Violation marked as synced:', id);
    } catch (error) {
        console.error('Error marking as synced:', error)
    }
}