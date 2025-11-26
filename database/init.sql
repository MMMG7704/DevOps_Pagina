CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

INSERT INTO users (name, email) VALUES
    ('Mariana', 'mariana@gmail.com'),
    ('Fany', 'fany@gmail.com'),
    ('Rubi', 'rubi@gmail.com');