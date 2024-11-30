import { Op } from "sequelize";
import admin from "../config/firebase-config.js";
import {
  APPROVED,
  CANCELED,
  CONFIRMED_USER_EXCHANGE,
  EXCHANGE_COMPLETED,
  EXCHANGE_IN_PROGRESS,
  OFFERED,
  PENDING_APPROVAL,
  PRODUCT_IMAGE,
  PRODUCT_VIDEO,
  PROFILE_PICTURE,
  REJECTED,
  WAITING_EXCHANGE_CONFIRMATION,
  WAITING_FOR_APPROVAL,
  WAITING_USER_CONFIRMATION,
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
        const exchange = await ProductRequests.findOne({
          where: {
            offering_product_id: product.product_id,
            status: PENDING_APPROVAL,
          },
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

export async function getPostRequestsList(req, res) {
  const { product_id } = req.query;

  try {
    // Obtener productos cuyo estado sea APPROVED
    const postRequestsList = await ProductRequests.findAll({
      where: {
        requesting_product_id: product_id,
        status: PENDING_APPROVAL,
      },
    });

    const response = await Promise.all(
      postRequestsList.map(async (request) => {
        // Obtener las imágenes del producto
        const multimediaImages = await MultimediaStorage.findAll({
          where: {
            product_id: request.offering_product_id,
            type: PRODUCT_IMAGE,
          },
        });

        const images = multimediaImages.map((media) => media.value);

        const product = await Product.findOne({
          where: { product_id: request.offering_product_id },
          attributes: ["title"],
        });

        const user = await Users.findOne({
          where: { user_id: request.offering_user_id },
        });

        const multimediaProfile = await MultimediaStorage.findOne({
          where: { user_id: request.offering_user_id, type: PROFILE_PICTURE },
        });

        return {
          ...request.toJSON(),
          offering_product_images: images,
          offering_product_title: product.title,
          user_requesting: {
            ...user.dataValues,
            profile_photo: multimediaProfile.dataValues.value,
          },
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    console.log("error:", error);

    res
      .status(500)
      .json({ message: "Error al obtener las solicitudes", error });
  }
}

export async function updateExchangeRequestStatus(req, res) {
  try {
    const { status, product_requests_id } = req.body;

    const [updated] = await ProductRequests.update(
      { status: status },
      {
        where: {
          product_requests_id: product_requests_id,
        },
        returning: true,
      }
    );

    if (updated && status === EXCHANGE_IN_PROGRESS) {
      // Obtener la solicitud actualizada
      const request = await ProductRequests.findOne({
        where: { product_requests_id: product_requests_id },
      });

      const product_id = request.dataValues.requesting_product_id;

      const [productUpdated] = await Product.update(
        { state: EXCHANGE_IN_PROGRESS },
        {
          where: { product_id: product_id },
        }
      );

      if (!productUpdated) {
        return res
          .status(400)
          .json({ message: "No se pudo actualizar el estado del producto." });
      }
      const {
        requesting_product_id,
        requesting_user_id,
        offering_product_id,
        offering_user_id,
      } = request?.dataValues;

      const bodyExchange = {
        offering_user_id,
        requesting_user_id,
        offering_product_id,
        requesting_product_id,
        status: WAITING_EXCHANGE_CONFIRMATION,
        status_offering_user: WAITING_USER_CONFIRMATION,
        status_requesting_user: WAITING_USER_CONFIRMATION,
        created_date: new Date(),
        modified_date: new Date(),
      };

      await Exchanges.create(bodyExchange);
    }

    res.status(200).json({ message: "Estado actualizado correctamente." });
  } catch (error) {
    console.log("Error al modificar estado de solicitud:", error);
    res
      .status(500)
      .json({ message: "Error al modificar estado de solicitud." });
  }
}

export async function getExchangeDetails(req, res) {
  const { product_id } = req.query;

  try {
    const exchange = await Exchanges.findOne({
      where: {
        [Op.or]: [
          { requesting_product_id: product_id },
          { offering_product_id: product_id },
        ],
      },
    });

    if (!exchange) {
      return res.status(404).json({
        message: "Trueque no encontrado",
      });
    }

    const {
      offering_user_id,
      requesting_user_id,
      offering_product_id,
      requesting_product_id,
      status_offering_user,
      status_requesting_user,
      status,
    } = exchange.dataValues;

    // Consultar información del usuario que solicita
    const requesting_user = await Users.findOne({
      where: { user_id: requesting_user_id },
    });

    const multimedia_requesting_user_profile = await MultimediaStorage.findOne({
      where: { user_id: requesting_user_id, type: PROFILE_PICTURE },
    });

    const requesting_product = await Product.findOne({
      where: { product_id: requesting_product_id },
    });

    const multimedia_images_requesting_product =
      await MultimediaStorage.findAll({
        where: { product_id: requesting_product_id, type: PRODUCT_IMAGE },
      });

    const images_requesting_product = multimedia_images_requesting_product.map(
      (image) => image.value
    );

    // Consultar información del usuario que ofrece
    const offering_user = await Users.findOne({
      where: { user_id: offering_user_id },
    });

    const multimedia_offering_user_profile = await MultimediaStorage.findOne({
      where: { user_id: offering_user_id, type: PROFILE_PICTURE },
    });

    const offering_product = await Product.findOne({
      where: { product_id: offering_product_id },
    });

    const multimedia_images_offering_product = await MultimediaStorage.findAll({
      where: { product_id: offering_product_id, type: PRODUCT_IMAGE },
    });

    const images_offering_product = multimedia_images_offering_product.map(
      (image) => image.value
    );

    const response = {
      exchange: {
        exchange_id: exchange?.dataValues?.exchange_id,
        status,
        status_offering_user,
        status_requesting_user,
      },
      requesting_user: {
        user: {
          id: requesting_user.user_id,
          name: requesting_user?.dataValues?.name,
          last_name: requesting_user?.dataValues?.last_name,
          profile_picture:
            multimedia_requesting_user_profile?.dataValues?.value || null,
        },
        product: {
          id: requesting_product?.dataValues?.product_id,
          title: requesting_product?.dataValues?.title,
          description: requesting_product?.dataValues?.description,
          images: images_requesting_product,
        },
      },
      offering_user: {
        user: {
          id: offering_user?.dataValues?.user_id,
          name: offering_user?.dataValues?.name,
          last_name: offering_user?.dataValues?.last_name,
          profile_picture:
            multimedia_offering_user_profile?.dataValues?.value || null,
        },
        product: {
          id: offering_product?.dataValues?.product_id,
          title: offering_product?.dataValues?.title,
          description: offering_product?.dataValues?.description,
          images: images_offering_product,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({
      message: "Error al recuperar la descripción del trueque",
      error: error.message,
    });
  }
}

export async function confirmExchange(req, res) {
  try {
    const { exchange_id, offering_user_id, requesting_user_id } = req.body;

    const updateData = offering_user_id
      ? { status_offering_user: CONFIRMED_USER_EXCHANGE }
      : { status_requesting_user: CONFIRMED_USER_EXCHANGE };

    const whereCondition = offering_user_id
      ? { offering_user_id, exchange_id }
      : { requesting_user_id, exchange_id };

    // Actualizar el estado del usuario correspondiente
    await Exchanges.update(updateData, {
      where: whereCondition,
    });

    // Verificar si ambos estados están confirmados
    let exchange = await Exchanges.findOne({ where: { exchange_id } });

    if (
      exchange.status_offering_user === CONFIRMED_USER_EXCHANGE &&
      exchange.status_requesting_user === CONFIRMED_USER_EXCHANGE
    ) {
      await Exchanges.update(
        { status: EXCHANGE_COMPLETED },
        { where: { exchange_id } }
      );
    }

    exchange = await Exchanges.findOne({ where: { exchange_id } });

    const { status, status_offering_user, status_requesting_user } =
      exchange.dataValues;

    const response = {
      status,
      status_offering_user,
      status_requesting_user,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error al modificar el estado de confirmación:", error);
    res
      .status(400)
      .json({ message: "Error al modificar el estado de confirmación." });
  }
}

export async function getExchangesHistory(req, res) {
  const { user_id } = req.query;

  try {
    const exchanges = await Exchanges.findAll({
      where: {
        [Op.or]: [
          { requesting_user_id: user_id },
          { offering_user_id: user_id },
        ],
      },
    });

    // Helper function to fetch and structure user and product data
    const getProductData = async (productId) => {
      const product = await Product.findOne({
        where: { product_id: productId },
      });
      const productImages = await MultimediaStorage.findAll({
        where: { product_id: productId, type: PRODUCT_IMAGE },
      });

      return {
        product_to_get: {
          id: product?.dataValues?.product_id,
          title: product?.dataValues?.title,
          images: productImages.map((image) => image.value),
        },
      };
    };

    const response = await Promise.all(
      exchanges.map(async (exchange) => {
        if (Number(user_id) === exchange.dataValues.requesting_user_id) {
          return {
            ...(await getProductData(exchange.dataValues.offering_product_id)),
            status: exchange.dataValues.status,
          };
        } else if (Number(user_id) === exchange.dataValues.offering_user_id) {
          return {
            ...(await getProductData(
              exchange.dataValues.requesting_product_id
            )),
            status: exchange.dataValues.status,
          };
        }
        return null;
      })
    );

    res.status(200).json(response.filter(Boolean)); // Filtra valores nulos
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar el historial de trueques",
      error: error.message,
    });
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
