import RequestItem from "./RequestItem";

const RequestsList = ({
  requestsList,
  auth,
  postDescription,
  onUpdateList,
}) => {
  return (
    <ul className="space-y-4">
      {requestsList?.map((request) => (
        <RequestItem
          key={request?.offering_product_id}
          request={request}
          auth={auth}
          postDescription={postDescription}
          onUpdateList={(updatedRequest) => {
            const updatedList = requestsList.map((item) =>
              item.product_requests_id === updatedRequest.product_requests_id
                ? { ...item, status: updatedRequest.status }
                : item
            );
            onUpdateList(updatedList);
          }}
        />
      ))}
    </ul>
  );
};

export default RequestsList;
