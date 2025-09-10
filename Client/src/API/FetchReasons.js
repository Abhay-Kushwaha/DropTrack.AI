const FetchReasons = async (id) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const response = await fetch(
    `http://localhost:3000/getReason` + (id ? `?reason=${id}` : ""),
    requestOptions
  );
  const result = await response.json();
  return result.data || [];
};

export default FetchReasons;
