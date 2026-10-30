import * as SQLite from "expo-sqlite";

export const openDatabase = async () => {
    return await SQLite.openDatabaseAsync('calendar.db');
}

export const createTable = async () => {
    const database = await openDatabase();
    try {
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            create table if not exists tasks(
                id integer primary key autoincrement,
                user text not null,
                date text not null,
                title text not null,
                description text
            );
        `);
        console.log('Table created')
    } catch (error) {
        console.error("Error creating table:", error)
    }
}

export const insertTask = async (user, date, title, description) => {
    if (!user || !date || !title) {
        return;
    }
    const database = await openDatabase();
    try {
        const result = await database.runAsync(
            'insert into tasks (user, date, title, description) values (?, ?, ?, ?)',
            user, date, title, description
        );
        console.log('Task inserted with id:', result.lastInsertRowId);
    } catch (error) {
        console.error('Error insert task:', error);
    }
}

// всі задачі користувача на конкретний день
export const fetchTasksByDate = async (user, date) => {
    const database = await openDatabase();
    try {
        const allRows = await database.getAllAsync(
            'select * from tasks where user = ? and date = ? order by id',
            user, date
        );
        console.log('All Tasks:', allRows);
        return allRows;
    } catch (error) {
        console.error('Error fetching tasks:', error)
        return [];
    }
};

// дні, в яких є задачі (для крапок у календарі)
export const fetchTaskDates = async (user, fromDate, toDate) => {
    const database = await openDatabase();
    try {
        const rows = await database.getAllAsync(
            'select distinct date from tasks where user = ? and date >= ? and date <= ?',
            user, fromDate, toDate
        );
        return rows.map((row) => row.date);
    } catch (error) {
        console.error('Error fetching task dates:', error)
        return [];
    }
};

export const updateTask = async (id, title, description) => {
    if (!id || !title) {
        return;
    }
    const database = await openDatabase();
    try {
        const res = await database.runAsync(
            'update tasks set title = ?, description = ? where id = ?',
            title, description, id
        )
        console.log('Task updated: ', res);
    } catch (error) {
        console.error('Error updating task: ', error)
    }
}

export const deleteTask = async (id) => {
    const database = await openDatabase();
    if (!id) {
        return;
    }
    try {
        const result = await database.runAsync('delete from tasks where id = ?', id);
        console.log('Task deleted:', result);
    } catch (error) {
        console.error('Error deleting task: ', error)
    }
}
