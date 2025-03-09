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
  PROFILE_PICTURE,
  WAITING_EXCHANGE_CONFIRMATION,
  WAITING_USER_CONFIRMATION,
} from "../constants/enums.js";
import {
  Category,
  Exchanges,
  MultimediaStorage,
  Product,
  ProductRequests,
  Users,
} from "../models/models.js";

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

      const requesting_product_id = request.dataValues.requesting_product_id;
      const offering_product_id = request.dataValues.offering_product_id;

      const [productsUpdated] = await Product.update(
        { state: EXCHANGE_IN_PROGRESS },
        {
          where: {
            [Op.or]: [
              { product_id: requesting_product_id },
              { product_id: offering_product_id },
            ],
          },
        }
      );

      if (!productsUpdated) {
        return res
          .status(400)
          .json({ message: "No se pudo actualizar el estado del producto." });
      }
      const { requesting_user_id, offering_user_id } = request?.dataValues;

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

      await Product.update(
        { state: EXCHANGE_COMPLETED },
        {
          where: {
            [Op.or]: [
              { product_id: exchange.offering_product_id },
              { product_id: exchange.requesting_product_id },
            ],
          },
        }
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