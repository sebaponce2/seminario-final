import { Op } from "sequelize";
import admin from "../config/firebase-config.js";
import {
  APPROVED,
  CANCELED,
  OFFERED,
  PENDING,
  PENDING_APPROVAL,
  PRODUCT_IMAGE,
  PRODUCT_VIDEO,
  PROFILE_PICTURE,
  REJECTED,
  WAITING_FOR_APPROVAL,
} from "../constants/enums.js";
import {
  Category,
  Exchanges,
  Location,
  MultimediaStorage,
  Product,
  ProductRequests,
  Role,
  Users,
} from "../models/models.js";

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
    console.log("error:", error);

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

export async function getPostsToExchange(req, res) {
  try {
    const { user_id, isService } = req.query;

    // Convertir isService a boolean
    const isServiceBool = isService === "true";

    // Construir las condiciones de filtrado dinámicamente
    const conditions = {
      state: APPROVED,
      [Op.or]: [{ user_id }],
    };

    if (isServiceBool) {
      conditions.category_id = 4;
    } else {
      conditions.category_id = { [Op.ne]: 4 };
    }

    const products = await Product.findAll({ where: conditions });

    const productsArray = await Promise.all(
      products.map(async (product) => {
        const multimedia = await MultimediaStorage.findAll({
          where: { product_id: product.product_id, type: PRODUCT_IMAGE },
        });

        const images = multimedia.map((media) => media.value);

        // Valida si existe un intercambio asociado
        console.log('product.product_id:', product.product_id);
        
        const exchange = await ProductRequests.findOne({
          where: { offering_product_id: product.product_id, status: PENDING_APPROVAL },
        });
        
        // Modificar el estado del producto si existe un intercambio
        const productState = exchange ? OFFERED : product.state;
        
        return {
          ...product.toJSON(),
          images,
          state: productState,
        };
      })
    );

    // Ordena los que tienen state === OFFERED al final
    const response = productsArray.sort((a, b) => {
      if (a.state === OFFERED && b.state !== OFFERED) return 1;
      if (a.state !== OFFERED && b.state === OFFERED) return -1;
      return 0;
    });

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al recuperar los productos", error });
  }
}

export async function createRequestExchange(req, res) {
  try {
    const {
      offering_user_id,
      requesting_user_id,
      offering_product_id,
      requesting_product_id,
    } = req.body;

    const bodyExchangeRequest = {
      offering_user_id,
      requesting_user_id,
      offering_product_id,
      requesting_product_id,
      status: PENDING_APPROVAL,
      created_date: new Date(),
      modified_date: null,
    };

    await ProductRequests.create(bodyExchangeRequest);

    res.status(201).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: "Error al crear solicitud de trueque " });
  }
}

export async function cancelExchangeRequest(req, res) {
  const token = req.headers.token;
  const user = await admin.auth().verifyIdToken(token);
  const { uid } = user;

  try {
    const { product_id } = req.body;

    const findUser = await Users.findOne({ where: { uid } });

    const user = findUser.dataValues;

    const [updated] = await ProductRequests.update(
      { status: CANCELED },
      {
        where: {
          offering_user_id: user.user_id,
          requesting_product_id: product_id,
        },
      }
    );

    if (updated) {
      res
        .status(200)
        .json({ message: "Estado de solicitud actualizada con éxito." });
    } else {
      res.status(404).json({ message: "Solicitud no encontrada." });
    }
  } catch (error) {
    console.log("Error al modificar publicación:", error);
    res.status(400).json({ message: "Error al modificar publicación." });
  }
}
