import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Link } from "react-router-dom";
import { CurrentStudentServices } from "./CuurentStudentServices";
import { useSelector } from "react-redux";

export default function CurrentStudent() {
  const [deleterefresh, setdeleterefresh] = useState(true);
  const [customers, setCustomers] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [first, setFirst] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValues, setGlobalFilterValues] = useState({
    Name: "",
    ContactNum: "",
    Email: "",
    District: "",
  });

  const schoolData = useSelector((state) => state.user.user);

  const sId = schoolData.School._id;

  useEffect(() => {
    CurrentStudentServices.getCustomersXLarge(sId).then((data) => {
      setCustomers(getCustomers(data));
      setLoading(false);
    });
    initFilters();
  }, [deleterefresh]);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    // Update the global filter value for all fields
    setGlobalFilterValues({
      Name: value,
      ContactNum: value,
      Email: value,
      District: value,
    });

    setFilters(_filters);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    // Set the global filter values for all fields to empty strings
    setGlobalFilterValues({
      Name: "",
      ContactNum: "",
      Email: "",
      District: "",
    });
  };

  const dt = useRef(null);

  // console.log(customers);
  let customerData = [];

  const exportExcel = async () => {
    await customers.map((customer) => {
      let newObject = {
        UID: customer._id,
        Name: customer.Name,
        Standard: customer.Standard,
        Gender: customer.Gender,
        AadharNumber: customer.AadharNumber,
        DOB: customer.DOB,
        Caste: customer.Caste,
        ContactNumber: customer.ContactNumber,
        SchoolID: customer.SchoolID[0].Name,
        State: customer.State.name,
        District: customer.District.district,
        Taluka: customer.Taluka.taluka,
        City: customer.City.city,
        Address: customer.Address,
        Disability: customer.Disability ? customer.Disability : 0,
        FamilyIncome: customer.FamilyIncome,
        ParentMaritalStatus: customer.ParentMaritalStatus,
        ParentOccupation: customer.ParentOccupation,
      };
      customerData.push(newObject);
    });

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(customerData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "Student Data");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const InactiveHandler = () => {
    if (selectedStudents.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select students',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      status: 0,
      students: selectedStudents,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://localhost:3000/deactivateStudent`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Student Inactive Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setdeleterefresh(prev => !prev); // Toggle the refresh state
        setSelectedStudents([]); // Clear selection after successful update
      })
      .catch((error) => {
        console.error("error", error);
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: 'Failed to mark students as inactive',
          showConfirmButton: false,
          timer: 1500
        });
      });
  };

  const calculateIndex = (pageNumber, rowIndex) => {
    return pageNumber * 10 + rowIndex + 1;
  };

  const openModal = () => {
    if (selectedStudents.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select students',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    setShowModal(true);
  };

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            onClick={exportExcel}
            data-pr-tooltip="XLS"
            lable="Export Excel"
          > Export Excel</Button>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            icon="pi pi-user-minus"
            severity="danger"
            onClick={InactiveHandler}
            label="Mark as Inactive"
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            icon="pi pi-user-minus"
            severity="danger"
            onClick={openModal}
            label="Mark as Dropout"
          />
        </div>
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData.DOB);
    return formatDate(date);
  };

  const formatDate = (value) => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  const dropOutHandler = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      status: 1,
      students: selectedStudents,
      reason: selectedValue,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://localhost:3000/deactivateStudent`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Student Dropout Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setdeleterefresh(false);
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      <div className="card p-10">
        <DataTable
          ref={dt}
          value={customers}
          paginator
          showGridlines
          stripedRows
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          dataKey="_id"
          filters={filters}
          globalFilterFields={[
            "Name",
            "UID",
            "AadharNumber",
            "Standard",
            "SchoolID.Medium.name",
            "City.cityType",
            "Caste",
            "Taluka.taluka",
            "City.city",
            "District.district",
            "Gender",
          ]}
          header={renderHeader()}
          emptyMessage="No Students found."
          removableSort
          selection={selectedStudents}
          onSelectionChange={(e) => setSelectedStudents(e.value)}
          onPage={(e) => setFirst(e.first)}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />

          <Column
            field="index"
            header="Index"
            body={(rowData) => {
              const rowIndex = customers.indexOf(rowData);
              return calculateIndex(Math.floor(first / 10), rowIndex);
            }}
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />

          <Column
            header="Name"
            field="Name"
            filterField="Name"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            sortable
            header="UID"
            field="_id"
            filterField="UID"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            sortable
            header="Gender"
            field="Gender"
            filterField="location"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            header="Aadhar Number"
            field="AadharNumber"
            filterField="AadharNumber"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />

          <Column
            sortable
            header="School Standard"
            field="Standard"
            filterField="Standard"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            header="DOB"
            field="DOB"
            filterField="DOB"
            body={dateBodyTemplate}
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            sortable
            header="District"
            field="District.district"
            filterField="District"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            header="City"
            field="City.city"
            filterField="City"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            sortable
            header="Taluka"
            field="Taluka.taluka"
            filterField="Taluka"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
          <Column
            sortable
            header="Caste"
            field="Caste"
            filterField="Caste"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />

          <Column
            header="City Type"
            field="City.cityType"
            filterField="City_type"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
            body={(e) => {
              return e.City.cityType === 0 ? "Urban" : "Rural";
            }}
          />

          <Column
            sortable
            header="School Medium"
            field="SchoolID.Medium.name" // Replace 'districtName' with the actual field name
            filterField="School_medium" // Make sure this matches the actual field name
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
            body={(e) => {
              return e.SchoolID[e.SchoolID.length - 1].Medium.name;
            }}
          />
          <Column
            header="Address"
            field="Address"
            filterField="Address"
            headerStyle={{ color: "#fff", backgroundColor: "#333" }}
            style={{
              backgroundColor: "#e9e9e9",
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#c0c0c0",
              borderWidth: "1px",
            }}
          />
        </DataTable>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">Select Dropout Reason</h2>
            <select
              value={selectedValue}
              onChange={handleDropdownChange}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a reason</option>
              <option value="financial">Financial Issues</option>
              <option value="academic">Academic Difficulties</option>
              <option value="personal">Personal Reasons</option>
              <option value="other">Other</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedValue) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Please select a reason',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    return;
                  }
                  dropOutHandler();
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
