const dal = require("./p.db");

async function getLogins() {
  let SQL = `SELECT * FROM public."Logins"`;
  try {
    let results = await dal.query(SQL, []);
    return results.rows;
  } catch (error) {
    console.log(error);
  }
}
async function getLoginByUsername(username) {
  let SQL = `SELECT * FROM public."Logins" WHERE username = $1`;
  try {
    let results = await dal.query(SQL, [username]);
    return results.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function getLoginByEmail(email) {
  let SQL = `SELECT * FROM public."Logins" WHERE email = $1`;
  try {
    let results = await dal.query(SQL, [email]);
    return results.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function getLoginById(id) {
  let SQL = `SELECT * FROM public."Logins" WHERE login_id = $1`;
  try {
    let results = await dal.query(SQL, [id]);
    return results.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function addLogin(name, email, password) {
  let SQL = `INSERT INTO public."Logins"(username, email, password)
    VALUES ($1, $2, $3) RETURNING login_id;`;
  try {
    let results = await dal.query(SQL, [name, email, password]);
    return results.rows[0].login_id;
  } catch (error) {
    if (error.code === "23505") return error.code;
    console.log(error);
  }
}

module.exports = {
  getLogins,
  getLoginByUsername,
  getLoginByEmail,
  getLoginById,
  addLogin,
};

