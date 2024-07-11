CREATE TABLE IF NOT EXISTS user(
    id integer PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    role text NOT NULL,
    createdAt datetime NOT NULL DEFAULT(datetime('now')),
    updatedAt datetime NOT NULL DEFAULT(datetime('now'))
);

CREATE INDEX IF NOT EXISTS user_id_idx ON user(id);
CREATE INDEX IF NOT EXISTS user_email_idx ON user(email);

CREATE TRIGGER IF NOT EXISTS user_update_trig 
AFTER UPDATE ON user
    BEGIN
        UPDATE user SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
