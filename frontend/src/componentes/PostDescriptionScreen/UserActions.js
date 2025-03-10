import {
  EXCHANGE_COMPLETED,
  EXCHANGE_IN_PROGRESS,
  PENDING_APPROVAL,
} from "../../constants/enums";

const UserActions = ({
  auth,
  postDescription,
  handleSendMessage,
  handleCancelExchangeRequest,
  navigate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {auth?.user_id === postDescription?.post_creator?.user_id ? (
        <button
          onClick={() => {
            postDescription?.state !== EXCHANGE_IN_PROGRESS &&
            postDescription?.state !== EXCHANGE_COMPLETED
              ? navigate("/requestsList", {
                  state: postDescription,
                })
              : navigate("/barteringDetails", {
                  state: postDescription,
                });
          }}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
        >
          {postDescription?.state !== EXCHANGE_IN_PROGRESS &&
          postDescription?.state !== EXCHANGE_COMPLETED
            ? "Ver listado de solicitudes"
            : "Ver estado del trueque"}
        </button>
      ) : (
        <>
          <button
            onClick={handleSendMessage}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
          >
            Enviar un mensaje
          </button>
          <button
            onClick={() => {
              postDescription?.user_post_status === PENDING_APPROVAL
                ? handleCancelExchangeRequest()
                : navigate("/selectPost", { state: postDescription });
            }}
            className={`${
              postDescription?.user_post_status === PENDING_APPROVAL
                ? "bg-red-800 hover:bg-red-700"
                : "bg-black hover:bg-gray-800"
            } text-white px-6 py-2 rounded-md transition duration-300`}
          >
            {postDescription?.user_post_status === PENDING_APPROVAL
              ? "Cancelar solicitud"
              : "Solicitar trueque"}
          </button>
        </>
      )}
    </div>
  );
};

export default UserActions;