export const DomainDataTableServices = {
  getData() {
    return fetch(`http://localhost:3000/stateWiseCount`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        return res.resultArray;
      });
  },

  getCustomersSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  },

  getCustomersMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getCustomersLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  },

  getCustomersXLarge() {
    return Promise.resolve(this.getData());
  },

  // getCustomers(params) {
  //   const queryParams = params
  //     ? Object.keys(params)
  //         .map(
  //           (k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
  //         )
  //         .join("&")
  //     : "";

  //   return fetch("http://localhost:3000/getSportsComplex" + queryParams).then(
  //     (res) => res.json()
  //   );
  // },
};
