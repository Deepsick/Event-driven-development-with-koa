const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');

const uuid = require('uuid/v4');

const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);

class Database {
  constructor(store) {
    if (store.split('.')[1] === 'json') {
      this.store = store;
    } else {
      throw new Error('use json format for storage');
    }
  }

  async isStoreExists() {
    try {
      return await existsAsync(this.store);
    } catch(err) {
      console.error(err.message);
    }
  }

  async _getDb() {
    if (await this.isStoreExists()) {
      const db = await readFileAsync(this.store);
      return this._prepareToRead(db);
    }

    return null;
  }

  _prepareToWrite(content) {
    return JSON.stringify(content);
  }

  _prepareToRead(content) {
    return JSON.parse(content);
  }

  async setDefaults(data) {
    const db = await this._getDb();
    if (!db) {
      await writeFileAsync(this.store, this._prepareToWrite(data));
    }
  }

  async findCollection(collection) {
    const db = await this._getDb();

    if (!db[collection]) {
      return 'No such collection in DB';
    }

    return db[collection];
  }

  async findRecord(collection, field, value) {
    const db = await this._getDb();

    if (!db[collection]) {
      return 'No such collection in DB';
    }
    
    if (!db[collection][0][field]) {
      return 'No such field in collection';
    }

    return db[collection].find((record) => record[field] === value);
  }

  async add(collection, record) {
    if (typeof record !== 'object') {
      return 'Record is not an object';
    }
    
    const db = await this._getDb();
    if (!db[collection]) {
      return 'No such collection in DB';
    }

    db[collection].push({ id: uuid(), ...record });
    await writeFileAsync(this.store, this._prepareToWrite(db));

    return record;
  }

  async deleteById(collection, id) {
    const db = await this._getDb();

    if (!db[collection]) {
      return 'No such collection in DB';
    }
    const index = db[collection].findIndex((record) => record.id === id);
    db[collection].splice(index, 1);
    await writeFileAsync(this.store, this._prepareToWrite(db));

    return index;
  }

  async updateById(collection, id, newRecord) {
    if (typeof newRecord !== 'object') {
      return 'Record is not an object';
    }
    
    const db = await this._getDb();
    if (!db[collection]) {
      return 'No such collection in DB';
    }

    const oldRecordIndex = db[collection].findIndex((record) => record.id === id);

    if (oldRecordIndex === -1) {
      return 'No record with provided id in DB';
    }

    db[oldRecordIndex] = newRecord;
    await writeFileAsync(this.store, this._prepareToWrite(db));

    return newRecord;
  }

  async destroyDb() {
    await unlinkAsync(this.store);
    this.store = null;
  }
}

module.exports = Database;
