-- Tabla Role
CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabla Category
CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabla Location
CREATE TABLE Location (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabla Users
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES Role(role_id),
    uid VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    age VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Product
CREATE TABLE Product (
    product_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id),
    category_id INT NOT NULL REFERENCES Category(category_id),
    location_id INT NOT NULL REFERENCES Location(location_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    state VARCHAR(50) NOT NULL,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Multimedia_storage
CREATE TABLE Multimedia_storage (
    storage_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Product(product_id),
    user_id INT REFERENCES Users(user_id),
    type VARCHAR(50) NOT NULL,
    value TEXT NOT NULL
);

-- Tabla Exchanges
CREATE TABLE Exchanges (
    exchange_id SERIAL PRIMARY KEY,
    offering_user_id INT NOT NULL REFERENCES Users(user_id),
    requesting_user_id INT NOT NULL REFERENCES Users(user_id),
    offering_product_id INT NOT NULL REFERENCES Product(product_id),
    requesting_product_id INT NOT NULL REFERENCES Product(product_id),
    status_offering_user VARCHAR(50) NOT NULL,
    status_requesting_user VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla Product_requests
CREATE TABLE Product_requests (
    product_requests_id SERIAL PRIMARY KEY,
    requesting_product_id INT NOT NULL REFERENCES Product(product_id),
    requesting_user_id INT NOT NULL REFERENCES Users(user_id),
    offering_product_id INT NOT NULL REFERENCES Product(product_id),
    offering_user_id INT NOT NULL REFERENCES Users(user_id),
    status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Chat
CREATE TABLE Chat (
    chat_id SERIAL PRIMARY KEY,
    first_user_id INT NOT NULL REFERENCES Users(user_id),
    second_user_id INT NOT NULL REFERENCES Users(user_id)
);

-- Tabla Message
CREATE TABLE Message (
    message_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id),
    chat_id INT NOT NULL REFERENCES Chat(chat_id),
    content TEXT NOT NULL,
    send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles
INSERT INTO Role(name) 
VALUES
('CLIENT'), 
('SUPER_ADMIN');

-- Insertar categorías
INSERT INTO Category(name) 
VALUES
('Muebles'), 
('Ropa'), 
('Autos'), 
('Servicios'), 
('Electrodomésticos'), 
('Juguetes'), 
('Construcción'),
('Salud'),
('Higiene');

-- Insertar provincias
INSERT INTO Location(name)
VALUES 
('Buenos Aires'),
('Catamarca'),
('Chaco'),
('Chubut'),
('Córdoba'),
('Corrientes'),
('Entre Ríos'),
('Formosa'),
('Jujuy'),
('La Pampa'),
('La Rioja'),
('Mendoza'),
('Misiones'),
('Neuquén'),
('Río Negro'),
('Salta'),
('San Juan'),
('San Luis'),
('Santa Cruz'),
('Santa Fe'),
('Santiago del Estero'),
('Tierra del Fuego'),
('Tucumán');

-- Insertar usuario admin
INSERT INTO Users(role_id, uid, name, last_name, age, email, password, phone, register_date) 
VALUES
(2, 'mL1NVF7JEQOBQzrgWGc5KOJ44UA2','User', 'Admin', 22, 'admin@gmail.com', '', 1, NOW());
