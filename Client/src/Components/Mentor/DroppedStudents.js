
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DropedStudentsServices } from "./DropoutStudentServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DropedStudents() {
  const [deleterefresh, setdeleterefresh] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValues, setGlobalFilterValues] = useState({
    Name: "",
    ContactNum: "",
    Email: "",
    District: "",
  });

  const schoolData = useSelector((state) => state.user.user);
  const sId = schoolData?.School?._id;
  const dt = useRef(null);
  const navigate = useNavigate();
  const [first, setFirst] = useState(0);

  useEffect(() => {
    if (!sId) return;
    setLoading(true);

    DropedStudentsServices.getCustomersXLarge(sId)
      .then((studentsArray) => {
        const dropped = studentsArray.filter(
          (s) => s.is_active === 1 || s.is_active === 2
        );
        setCustomers(getCustomers(dropped));
      })
      .catch((err) => {
        console.error("Error fetching dropped students:", err);
        setCustomers([]);
      })
      .finally(() => setLoading(false));

    initFilters();
  }, [deleterefresh, sId]);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      if (d.date) d.date = new Date(d.date);
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
    setGlobalFilterValues({
      Name: "",
      ContactNum: "",
      Email: "",
      District: "",
    });
  };

  const exportExcel = async () => {
    if (!Array.isArray(customers) || customers.length === 0) {
      Swal.fire("Info", "No data available to export.", "info");
      return;
    }

    const xlsx = await import("xlsx");

    const excelData = customers.map((c) => ({
      Name: c.Name,
      UID: c._id,
      Gender: c.Gender,
      Reason: c.Reasons || "-",
      DropoutType:
        c.is_active === 0
          ? "Student Dropout With Reason"
          : "Student Dropout (Predicted)",
      AadharNumber: c.AadharNumber,
      Standard: c.Standard,
      DOB: c.DOB ? formatDate(new Date(c.DOB)) : "",
      District: c.District?.district || "",
      City: c.City?.city || "",
      Taluka: c.Taluka?.taluka || "",
      Caste: c.Caste,
      CityType: c.City?.cityType === 0 ? "Urban" : "Rural",
      ContactNumber: c.ContactNumber,
      Email: c.Email,
    }));

    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    import("file-saver").then((module) => {
      if (module && module.default) {
        const saveAs = module.default;
        const data = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(data, "DroppedStudents.xlsx");
      }
    });
  };

  const sendWhatsApp = async (message) => {
    try {
      await fetch("http://localhost:8000/DRF_Gmail_WhatsApp_Api/notify/whatsapp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      Swal.fire("Success", "WhatsApp message sent!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to send WhatsApp", "error");
    }
  };

  const sendEmail = async (message) => {
    try {
      await fetch("http://localhost:8000/DRF_Gmail_WhatsApp_Api/notify/email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      Swal.fire("Success", "Email sent!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to send Email", "error");
    }
  };

  const renderHeader = () => (
    <>
      <div className="flex align-items-center justify-end gap-2 m-2">
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          onClick={exportExcel}
          className="bg-green-900 text-white hover:bg-green-700 p-2 rounded-md"
        >
          Download Excel File
        </Button>
      </div>
      <div className="flex justify-between mr-2">
        <Button
          type="button"
          label="Clear"
          outlined
          className="px-4 py-2 rounded-lg text-blue-800 border-2 border-blue-700 hover:bg-gray-200"
          onClick={clearFilter}
        />
        <span className="p-input-icon-left">
          <InputText
            value={globalFilterValues.Name}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="p-2 ring-1 ring-black focus:ring-blue-600 hover:ring-blue-400"
          />
        </span>
      </div>
    </>
  );

  const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData.DOB);
    return formatDate(date);
  };

  const formatDate = (value) => {
    if (value instanceof Date && !isNaN(value)) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  const calculateIndex = (currentPage, rowIndex) =>
    currentPage * 10 + rowIndex + 1;

  const header = renderHeader();

  return (
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
          "District.district",
          "Gender",
        ]}
        header={header}
        emptyMessage="No Dropped Students found."
        removableSort
        selection={selectedStudents}
        onSelectionChange={(e) => setSelectedStudents(e.value)}
      >
        <Column selectionMode="multiple" />
        <Column
          header="Index"
          body={(rowData) => {
            const rowIndex = customers.indexOf(rowData);
            return calculateIndex(Math.floor(first / 10), rowIndex);
          }}
        />
        <Column field="Name" header="Name" sortable />
        <Column field="_id" header="UID" sortable />
        <Column field="Gender" header="Gender" />
        <Column field="Reasons" header="Reason" body={(row) => row.Reasons || "-"} />
        <Column
          field="is_active"
          header="Dropout Type"
          body={(row) =>
            row.is_active === 0
              ? "Student Dropout With Reason"
              : "Student Dropout (Predicted)"
          }
        />
        <Column field="AadharNumber" header="Aadhar Number" />
        <Column field="Standard" header="Standard" sortable />
        <Column field="DOB" header="DOB" body={dateBodyTemplate} />
        <Column field="District.district" header="District" />
        <Column field="City.city" header="City" />
        <Column field="Taluka.taluka" header="Taluka" />
        <Column field="Caste" header="Caste" />
        <Column
          header="City Type"
          body={(row) => (row.City?.cityType === 0 ? "Urban" : "Rural")}
        />

        <Column
          header="Actions"
          body={(row) => {
            const customMessage = `Dear ${row.Name},

We understand that you had to discontinue your studies. We truly care about your future and would be happy to support you in continuing your education.

If you wish, you can schedule a counseling session with us to discuss the best way forward which is free of cost.  
You may also log in to our student portal for guidance and resources and schedule appointment with a counselor at no cost: http://localhost:3001/

Warm regards,  
School Support Team`;

            return (
              <div className="flex gap-2">
                <Button
                  label="WhatsApp"
                  className="bg-green-600 text-white px-2 py-1 rounded-md"
                  onClick={() => sendWhatsApp(customMessage)}
                />
                <Button
                  label="Email"
                  className="bg-blue-600 text-white px-2 py-1 rounded-md"
                  onClick={() => sendEmail(customMessage)}
                />
              </div>
            );
          }}
        />
      </DataTable>
    </div>
  );
}
