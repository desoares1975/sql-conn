'use strict';

const mysql = require('mysql');
const mssql = require('mssql');
const Bluebird = require('bluebird');

function MySQL(config) {
  this.connection = Bluebird.promisifyAll(mysql.createPool(config));
  this.query = Bluebird.promisify((query, cb) => {
    this.connection.queryAsync(query.text, query.values)
    .then(result => cb(null, result))
    .catch(e => cb(e));
  });
  this.close = this.connection.end;
}

function MSSQL(config) {
  new mssql.ConnectionPool(config).connect()
  .then(pool => {
    this.connection = pool;
    this.query = pool.query;
  });
}

module.exports = {
  'mysql': MySQL,
  'mssql': MSSQL
};