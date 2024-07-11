CREATE TABLE IF NOT EXISTS session (
    id integer PRIMARY KEY,
    userId integer NOT NULL REFERENCES user(id),
    expiresAt datetime NOT NULL,
    createdAt datetime NOT NULL DEFAULT(datetime('now'))
);

CREATE INDEX IF NOT EXISTS session_id_idx ON session(id);
CREATE INDEX IF NOT EXISTS session_userId_idx ON session(userId);
