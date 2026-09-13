import mysql from "mysql2/promise";

let pool;


const getMysqlConfig = () => ({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "crm_leads",
});


const ensureDatabaseExists = async () => {
  const { host, port, user, password, database } = getMysqlConfig();

  const bootstrapConnection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  await bootstrapConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );

  await bootstrapConnection.end();
};


const LEADS_COLUMNS = [
  ["company_id", "INT NULL"],
  ["email", "VARCHAR(255)"],
  ["phone", "VARCHAR(100)"],
  ["company", "VARCHAR(255)"],
  ["message", "TEXT"],
  ["website", "TEXT"],
  ["address", "TEXT"],
  ["website_status", "VARCHAR(100)"],
  ["https", "VARCHAR(50)"],
  ["mobile_responsive", "VARCHAR(50)"],
  ["page_speed", "VARCHAR(100)"],
  ["outdated_indicators", "TEXT"],
  ["lead_score", "DECIMAL(10,2)"],
  ["google_rating", "DECIMAL(3,2)"],
  ["google_review_count", "INT"],
  ["google_reviews_url", "TEXT"],
  ["google_maps_url", "TEXT"],
  ["facebook", "TEXT"],
  ["instagram", "TEXT"],
  ["linkedin", "TEXT"],
  ["youtube", "TEXT"],
  ["social_media_found", "VARCHAR(100)"],
  ["social_media_links", "TEXT"],
  ["email_count", "INT"],
  ["email_source", "TEXT"],
  ["email_type", "VARCHAR(100)"],
  ["all_emails", "TEXT"],
  ["source", "VARCHAR(100) DEFAULT 'Website'"],
  [
    "status",
    `ENUM('new','contacted','replied','interested','meeting_scheduled','proposal_sent','negotiation','won','lost') DEFAULT 'new'`,
  ],
  ["follow_up_date", "DATETIME NULL"],
  ["last_contacted_at", "DATETIME NULL"],
  ["won_at", "DATETIME NULL"],
  ["lost_at", "DATETIME NULL"],
  ["lost_reason", "ENUM('price','competitor','not_interested','no_response','other') NULL"],
  ["imported_from", "VARCHAR(255)"],
  ["image_url", "TEXT"],
  ["top_comments", "TEXT"],
  ["created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"],
  ["updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"],
];

const USERS_COLUMNS = [
  ["company_name", "VARCHAR(255)"],
  ["company_description", "TEXT"],
  ["created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"],
  ["updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"],
];


const ensureColumns = async (table, columns) => {
  const [existingRows] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table]
  );
  const existingNames = new Set(existingRows.map((row) => row.COLUMN_NAME));

  for (const [name, definition] of columns) {
    if (existingNames.has(name)) continue;

    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
    console.log(`MySQL migration: added missing column "${name}" to "${table}"`);
  }
};


const ensureTablesExist = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      company_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await ensureColumns("users", USERS_COLUMNS);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,

      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(100),
      company VARCHAR(255),
      message TEXT,

      website TEXT,
      address TEXT,
      website_status VARCHAR(100),
      https VARCHAR(50),
      mobile_responsive VARCHAR(50),
      page_speed VARCHAR(100),
      outdated_indicators TEXT,
      lead_score DECIMAL(10,2),

      google_rating DECIMAL(3,2),
      google_review_count INT,
      google_reviews_url TEXT,
      google_maps_url TEXT,

      facebook TEXT,
      instagram TEXT,
      linkedin TEXT,
      youtube TEXT,
      social_media_found VARCHAR(100),
      social_media_links TEXT,

      email_count INT,
      email_source TEXT,
      email_type VARCHAR(100),
      all_emails TEXT,

      source VARCHAR(100) DEFAULT 'Website',
      status ENUM(
        'new', 'contacted', 'replied', 'interested', 'meeting_scheduled',
        'proposal_sent', 'negotiation', 'won', 'lost'
      ) DEFAULT 'new',

      follow_up_date DATETIME NULL,
      last_contacted_at DATETIME NULL,
      won_at DATETIME NULL,
      lost_at DATETIME NULL,
      lost_reason ENUM('price', 'competitor', 'not_interested', 'no_response', 'other') NULL,

      imported_from VARCHAR(255),
      image_url TEXT,
      top_comments TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_leads_company (company_id),
      INDEX idx_leads_status (status),
      INDEX idx_leads_email (email),
      INDEX idx_leads_phone (phone),
      CONSTRAINT fk_leads_company FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await ensureColumns("leads", LEADS_COLUMNS);

  try {
    await pool.query("ALTER TABLE leads ADD INDEX idx_leads_company (company_id)");
  } catch (error) {
    if (error.code !== "ER_DUP_KEYNAME") throw error;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lead_notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      text TEXT NOT NULL,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_notes_lead (lead_id),
      CONSTRAINT fk_notes_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      CONSTRAINT fk_notes_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Multiple follow-ups per lead, each with its own optional note.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lead_follow_ups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      due_date DATETIME NOT NULL,
      note TEXT,
      status ENUM('pending', 'done') DEFAULT 'pending',
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_followups_lead (lead_id),
      CONSTRAINT fk_followups_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      CONSTRAINT fk_followups_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

const connectDB = async () => {
  try {
    await ensureDatabaseExists();

    const { host, port, user, password, database } = getMysqlConfig();

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      decimalNumbers: true,
    });

    // Sanity-check the connection before continuing.
    const connection = await pool.getConnection();
    connection.release();

    await ensureTablesExist();

    console.log(`MySQL Connected: ${host}/${database}`);
  } catch (error) {
    console.error(`MySQL Error: ${error.message}`);
    process.exit(1);
  }
};

// Other modules import { getPool } to run queries once connectDB() has run.
export const getPool = () => {
  if (!pool) {
    throw new Error("Database pool has not been initialized yet. Call connectDB() first.");
  }
  return pool;
};

export default connectDB;
