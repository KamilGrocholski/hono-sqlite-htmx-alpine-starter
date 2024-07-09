CREATE TABLE IF NOT EXISTS user(
    id integer PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    role text NOT NULL
);

CREATE INDEX IF NOT EXISTS user_id_idx ON user(id);
CREATE INDEX IF NOT EXISTS user_email_idx ON user(email);
