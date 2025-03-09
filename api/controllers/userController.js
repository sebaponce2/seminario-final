import admin from "../config/firebase-config.js";
import { PROFILE_PICTURE } from "../constants/enums.js";
import { MultimediaStorage, Role, Users } from "../models/models.js";

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
    res.status(400).json({ message: "Error al crear usuario" });
  }
}

export async function getUserLogin(req, res) {
  try {
    const { uid } = req.query;

    const user = await Users.findOne({ where: { uid } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const role = await Role.findOne({
      where: user.dataValues.role_id,
      attributes: ["name"],
    });

    const multimedia = await MultimediaStorage.findOne({
      where: { user_id: user.dataValues.user_id },
      attributes: ["value"],
    });

    const { role_id, register_date, password, ...filteredUserData } =
      user.dataValues;

    const response = {
      ...filteredUserData,
      profile_picture: multimedia?.value || null,
      role: role.name,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar el usuario", error });
  }
}

export async function getProfileDetails(req, res) {
  const token = req.headers.token;
  const user = await admin.auth().verifyIdToken(token);
  const { uid } = user;

  try {
    const user = await Users.findOne({ where: { uid } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const multimedia = await MultimediaStorage.findOne({
      where: { user_id: user.dataValues.user_id },
      attributes: ["value"],
    });

    const { name, last_name, email, age, phone } = user.dataValues;

    const response = {
      profile_picture: multimedia?.value || null,
      name,
      last_name,
      email,
      age,
      phone,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar el usuario", error });
  }
}