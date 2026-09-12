import bcrypt from "bcryptjs";
import { getPool } from "../config/db.js";

// Converts a MySQL `users` row into the camelCase shape the rest of the
// app expects. `_id` is kept as an alias of `id` so existing frontend
// code that still reads `user._id` keeps working untouched.
const rowToUser = (row, { includePassword = false } = {}) => {
  if (!row) return null;

  const user = {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    companyName: row.company_name,
    companyDescription: row.company_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (includePassword) {
    user.password = row.password;
  }

  return user;
};

const findByEmail = async (email) => {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rowToUser(rows[0], { includePassword: true });
};

const findById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rowToUser(rows[0]);
};

const create = async ({ name, email, password, companyName, companyDescription }) => {
  const pool = getPool();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, company_name, company_description)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email.toLowerCase().trim(), hashedPassword, companyName, companyDescription || ""]
  );

  return findById(result.insertId);
};

const matchPassword = async (enteredPassword, hashedPassword) => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

const getAllCompanies = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id, company_name FROM users ORDER BY company_name ASC"
  );

  return rows.map((row) => ({
    _id: row.id,
    id: row.id,
    companyName: row.company_name,
  }));
};

const User = {
  findByEmail,
  findById,
  create,
  matchPassword,
  getAllCompanies,
};

export default User;
