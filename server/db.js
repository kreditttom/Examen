const Database = require('better-sqlite3');

const db = new Database('server.db');

db.exec(`
  create table if not exists users(
    id integer primary key autoincrement,
    firstName text not null,
    lastName text not null,
    email text not null unique,
    password text not null
  );

  create table if not exists violations(
    id integer primary key autoincrement,
    description text not null,
    url text,
    date text not null,
    userId integer not null,
    latitude real,
    longitude real,
    foreign key (userId) references users(id)
  );
`);

console.log('Database ready');

module.exports = db;