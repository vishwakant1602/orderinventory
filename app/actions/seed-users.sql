-- Check if users table exists, if not create it
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user if it doesn't exist
INSERT INTO users (username, password, full_name, role, active)
VALUES ('admin', 'password', 'Admin User', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Insert regular user if it doesn't exist
INSERT INTO users (username, password, full_name, role, active)
VALUES ('user', 'password', 'Regular User', 'user', true)
ON CONFLICT (username) DO NOTHING;
