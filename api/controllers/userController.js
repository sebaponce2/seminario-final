import {
  PRODUCT_IMAGE,
  PRODUCT_VIDEO,
  PROFILE_PICTURE,
  WAITING_FOR_APPROVAL,
} from "../constants/enums.js";
import { MultimediaStorage, Product, Role, Users } from "../models/user.js";

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

// Crear una publicación
export async function createPost(req, res) {
  try {
    const { images, isService, video, ...filteredBody } = req.body;

    const bodyProduct = {
      ...filteredBody,
      state: WAITING_FOR_APPROVAL,
      register_date: new Date(),
    };

    const newProduct = await Product.create(bodyProduct);

    if (newProduct) {
      const { product_id } = newProduct.dataValues;
      const bodyImage = images.map((image) => {
        return {
          value: image,
          type: PRODUCT_IMAGE,
          product_id,
        };
      });

      MultimediaStorage.bulkCreate(bodyImage);

      if (!isService) {
        const bodyVideo = {
          value: video,
          type: PRODUCT_VIDEO,
          product_id
        }

        MultimediaStorage.create(bodyVideo);
      }
    }

    res.status(201).json({message: "OK"});
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación" });
  }
}