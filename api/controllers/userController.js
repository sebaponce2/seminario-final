import { user } from '../models/user.js';

// Obtener todos los usuarios
export async function getUsers(req, res) {
  try {
    const users = await user.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

// Crear un nuevo usuario
export async function createUser(req, res) {
  try {
    const newUser = await user.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear usuario' });
  }
}
