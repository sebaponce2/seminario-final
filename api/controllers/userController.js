import { PROFILE_PICTURE } from '../constants/enums.js';
import { MultimediaStorage, Users } from '../models/user.js';

// Crear un nuevo usuario
export async function createUser(req, res) {
  try {
    const newUser = await Users.create(req.body);
    
    const { profile_picture } = req.body;
    const { user_id } = newUser.dataValues;
    
    if (profile_picture && profile_picture.trim() !== "") {
      const bodyProfileImage = {
        product_id: null,
        user_id: user_id,
        type: PROFILE_PICTURE,
        value: profile_picture,
      };

      await MultimediaStorage.create(bodyProfileImage);
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear usuario' });
  }
}
