import { Op } from "sequelize";
import admin from "../config/firebase-config.js";
import {
  APPROVED,
  PRODUCT_IMAGE,
  PRODUCT_VIDEO,
  WAITING_FOR_APPROVAL,
  REJECTED,
  PROFILE_PICTURE,
  PENDING_APPROVAL,
} from "../constants/enums.js";
import {
  Category,
  Location,
  MultimediaStorage,
  Product,
  ProductRequests,
  Users,
} from "../models/models.js";

// Crear una publicación
export async function createPost(req, res) {
  try {
    const { images, isService, video, category_id, ...filteredBody } = req.body;

    const bodyProduct = {
      ...filteredBody,
      state: WAITING_FOR_APPROVAL,
      register_date: new Date(),
      category_id: category_id ? category_id : 4,
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
          product_id,
        };

        MultimediaStorage.create(bodyVideo);
      }
    }

    res.status(201).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación" });
  }
}

export async function getProvinces(req, res) {
  try {
    const provinces = await Location.findAll();

    res.status(200).json(provinces);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar las provincias" });
  }
}

export async function getCategories(req, res) {
  const { bringAll } = req.query;
  
  try {
    let categories;
    
    if (bringAll === "true") {
      categories = await Category.findAll();
    } else {
      categories = await Category.findAll({
        where: {
          name: { [Op.ne]: "Servicios" }
        }
      });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar las categorías" });
  }
}

export async function getPostsClient(req, res) {
  try {
    // Obtener productos cuyo estado sea APPROVED
    const products = await Product.findAll({
      where: { state: APPROVED },
    });

    const response = await Promise.all(
      products.map(async (product) => {
        // Obtener las imágenes del producto
        const multimedia = await MultimediaStorage.findAll({
          where: { product_id: product.product_id, type: PRODUCT_IMAGE },
        });

        const images = multimedia.map((media) => media.value);

        const category = await Category.findOne({
          where: { category_id: product.category_id },
          attributes: ["name"],
        });

        const location = await Location.findOne({
          where: { location_id: product.location_id },
          attributes: ["name"],
        });

        return {
          ...product.toJSON(),
          images,
          category: category.name,
          location: location.name,
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al recuperar los productos", error });
  }
}

export async function getPostsAdmin(req, res) {
  try {
    // Obtener productos cuyo estado sea WAITING_FOR_APPROVAL
    const products = await Product.findAll({
      where: { state: WAITING_FOR_APPROVAL },
    });

    const response = await Promise.all(
      products.map(async (product) => {
        const multimedia = await MultimediaStorage.findAll({
          where: { product_id: product.product_id, type: PRODUCT_IMAGE },
        });

        const images = multimedia.map((media) => media.value);

        // Obtener el nombre de la categoría
        const category = await Category.findOne({
          where: { category_id: product.category_id },
          attributes: ["name"],
        });

        const location = await Location.findOne({
          where: { location_id: product.location_id },
          attributes: ["name"],
        });

        return {
          ...product.toJSON(),
          images,
          category: category.name,
          location: location.name,
          type: category.name === "Servicios" ? "Servicio" : "Bien",
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al recuperar los productos", error });
  }
}

export async function getPostDescription(req, res) {
  const token = req.headers.token;
  const user = await admin.auth().verifyIdToken(token);
  const { uid } = user;
  const { product_id } = req.params;

  try {
    const product = await Product.findOne({
      where: { product_id: product_id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    const { user_id, category_id, location_id } = product.dataValues;

    const multimediaProfile = await MultimediaStorage.findOne({
      where: { user_id: user_id, type: PROFILE_PICTURE },
    });

    const multimediaVideo = await MultimediaStorage.findOne({
      where: { product_id: product_id, type: PRODUCT_VIDEO },
    });

    const multimediaImages = await MultimediaStorage.findAll({
      where: { product_id: product_id, type: PRODUCT_IMAGE },
    });

    const images = multimediaImages.map((media) => media.value);

    const post_creator = await Users.findOne({
      where: { user_id: user_id },
    });

    const category = await Category.findOne({
      where: { category_id: category_id },
      attributes: ["name"],
    });

    const location = await Location.findOne({
      where: { location_id: location_id },
      attributes: ["name"],
    });

    const findUser = await Users.findOne({ where: { uid } });

    const user = findUser.dataValues;

    const exchange = await ProductRequests.findOne({
      where: {
        offering_user_id: user.user_id,
        requesting_product_id: product_id,
        status: PENDING_APPROVAL,
      },
    });

    const response = {
      ...product.toJSON(),
      images,
      category: category.name,
      location: location.name,
      video: multimediaVideo ? multimediaVideo.dataValues.value : null,
      type: category.name === "Servicios" ? "Servicio" : "Bien",
      post_creator: {
        profile_picture: multimediaProfile
          ? multimediaProfile.dataValues.value
          : null,
        ...post_creator.dataValues,
      },
      user_post_status: exchange?.dataValues?.status ?? null,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar la descripcion de la publicación",
      error: error.message,
    });
  }
}

export async function updatePostStatus(req, res) {
  try {
    const { product_id, isApproved } = req.body;

    const newState = isApproved ? APPROVED : REJECTED;

    // Actualiza el producto en la base de datos
    const [updated] = await Product.update(
      { state: newState },
      {
        where: {
          product_id: product_id,
        },
      }
    );

    if (updated) {
      res
        .status(200)
        .json({ message: "Estado del producto actualizado con éxito." });
    } else {
      res.status(404).json({ message: "Producto no encontrado." });
    }
  } catch (error) {
    console.log("Error al modificar publicación:", error);
    res.status(400).json({ message: "Error al modificar publicación." });
  }
}

export const getMyPosts = async (req, res) => {
  const token = req.headers.token;
  const user = await admin.auth().verifyIdToken(token);
  const { uid } = user;

  try {
    const findUser = await Users.findOne({ where: { uid } });

    const user = findUser.dataValues;

    const products = await Product.findAll({
      where: { user_id: user.user_id },
    });

    const response = await Promise.all(
      products.map(async (product) => {
        const multimedia = await MultimediaStorage.findAll({
          where: { product_id: product.product_id, type: PRODUCT_IMAGE },
        });

        const images = multimedia.map((media) => media.value);

        const category = await Category.findOne({
          where: { category_id: product.category_id },
          attributes: ["name"],
        });

        return {
          ...product.toJSON(),
          images,
          category: category.name,
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al recuperar las publicaciones", error });
  }
};