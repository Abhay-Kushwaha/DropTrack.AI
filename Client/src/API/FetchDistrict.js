const FetchDistrict = async (state) => {
  console.log(state);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const response = await fetch(
    `http://localhost:3000/getDistricts?state=${state || null}`,
    requestOptions
  );
  const result = await response.json();
  return result.data || [];
};

export default FetchDistrict;
