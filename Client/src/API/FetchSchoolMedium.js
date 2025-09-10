const FetchSchoolMedium = async () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const response = await fetch(
    "http://localhost:3000/getSchoolType",
    requestOptions
  );
  const result = await response.json();
  return result.data || [];
};

export default FetchSchoolMedium;
