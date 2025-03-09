import { useNavigate } from "react-router-dom"
import { EXCHANGE_IN_PROGRESS } from "../../constants/enums"
import { updateStatusExchangeRequest } from "../../services/posts"
import StatusDropdown from "./StatusDropdown"

const RequestItem = ({ request, auth, postDescription, onUpdateList }) => {
  const navigate = useNavigate()

  const handleChangeState = async (product_requests_id, newStatus) => {
    try {
      const body = {
        status: newStatus,
        product_requests_id,
      }
      await updateStatusExchangeRequest(body, auth.token)

      onUpdateList({ ...request, status: newStatus })

      if (newStatus === EXCHANGE_IN_PROGRESS) {
        navigate("/detailsPost", {
          state: postDescription?.product_id,
        })
      }
    } catch (error) {
      console.log("Error:", error)
    }
  }

  return (
    <li className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-3">
        <img
          src={request?.user_requesting?.profile_photo || "/placeholder.svg"}
          alt={request?.user_requesting?.name}
          className="w-10 h-10 rounded-full"
        />
        <h2 className="font-semibold">{`${request?.user_requesting?.name} ${request?.user_requesting?.last_name}`}</h2>
      </div>
      <div className="flex items-start space-x-4">
        <img
          src={
            Array.isArray(request?.offering_product_images) && request?.offering_product_images[0]
              ? request.offering_product_images[0]
              : "URL_DE_IMAGEN_POR_DEFECTO"
          }
          alt="Producto"
          className="w-10 h-10 object-cover rounded-md"
        />

        <p className="text-sm text-gray-600 flex-1">{request?.offering_product_title}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() =>
            navigate("/detailsPost", {
              state: request.offering_product_id,
            })
          }
          className="px-4 py-2 bg-black text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Ver publicación
        </button>
        <StatusDropdown
          currentStatus={request.status}
          onStatusChange={(newStatus) => handleChangeState(request.product_requests_id, newStatus)}
        />
      </div>
    </li>
  )
}

export default RequestItem