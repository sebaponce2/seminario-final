import { client } from "./client";

export const createNewPost = async (body, token) => {
  return await client.post("createPost", body, {
    headers: {
      token,
    },
  });
};

export const getPostsUserClient = async (token) => {
  return await client
    .get("getPostsClient", {
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const getPostsUserAdmin = async (token) => {
  return await client
    .get("getPostsAdmin", {
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const getDescriptionPost = async (productId, token) => {
  return await client
    .get(`getPostDescription/${productId}`, {
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const updateStatusPost = async (body, token) => {
  try {
    const response = await client.put(`updatePostStatus`, body, {
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del post:", error);
    throw error;
  }
};

export const getMyPostsToExchange = async (user_id, isService, token) => {
  return await client
    .get("getPostsToExchange", {
      params: {
        user_id,
        isService,
      },
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const createNewExchangeRequest = async (body, token) => {
  return await client.post("createExchangeRequest", body, {
    headers: {
      token,
    },
  });
};

export const cancelRequestExchange = async (body, token) => {
  try {
    const response = await client.put(`cancelExchangeRequest`, body, {
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del post:", error);
    throw error;
  }
};

export const getRequestsList = async (product_id, token) => {
  return await client
    .get("getPostRequestsList", {
      params: {
        product_id,
      },
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const updateStatusExchangeRequest = async (body, token) => {
  try {
    const response = await client.put(`updateExchangeRequestStatus`, body, {
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del post:", error);
    throw error;
  }
};

export const getDetailsExchange = async (requesting_product_id, token) => {
  return await client
    .get("getExchangeDetails", {
      params: {
        requesting_product_id,
      },
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const exchangeConfirmation = async (body, token) => {
  try {
    const response = await client.put(`confirmExchange`, body, {
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado de confirmación:", error);
    throw error;
  }
};
