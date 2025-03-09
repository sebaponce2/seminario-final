import { useEffect, useState } from "react"
import { getRequestsList } from "../../services/posts"
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage"
import { useLocation } from "react-router-dom"
import Loader from "react-js-loader"
import RequestsList from "../../componentes/PostRequestList/RequestList"

export const PostRequestsList = () => {
  const [requestsList, setRequestsList] = useState()
  const [auth, setAuth] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const location = useLocation()
  const { state: postDescription } = location || {}

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const auth = await loadFromLocalStorage("auth")
    setAuth(auth)

    const data = await getRequestsList(postDescription?.product_id, auth.token)

    if (data) {
      setRequestsList(data)
    }

    setIsLoading(false)
  }

  const handleUpdateRequestsList = (updatedList) => {
    setRequestsList(updatedList)
  }

  return (
    <div className="min-h-screen bg-[#E5E7EA] flex items-center justify-center p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Solicitudes de Trueque</h1>
          <RequestsList
            requestsList={requestsList}
            auth={auth}
            postDescription={postDescription}
            onUpdateList={handleUpdateRequestsList}
          />
        </div>
      )}
    </div>
  )
}
