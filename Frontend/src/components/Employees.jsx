import axios from "axios";
import React, { useEffect, useState } from "react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(15); // Number of employees per page
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // Filter for role
  const axiosBaseURL = "http://localhost:8000/api";

  const fetchEmployees = async () => {
    try {
      const options = {
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${axiosBaseURL}/user/getallemployees`,
        {},
        options
      );
  
      console.log("API Response:", response.data); // Debugging log
  
      const fetchedEmployees = response.data.employees;
  
      // Check if attendance data exists
      const employeesWithTotalTime = fetchedEmployees.map((employee) => {
        console.log(`Employee ${employee.name} attendance:`, employee.attendance);
  
        if (employee.attendance && Array.isArray(employee.attendance) && employee.attendance.length > 0) {
          const totalTime = employee.attendance.reduce((total, record) => {
            if (!record.checkIn || !record.checkOut) {
              console.warn(`Missing checkIn or checkOut for ${employee.name}`, record);
              return total;
            }
  
            const checkIn = new Date(record.checkIn);
            const checkOut = new Date(record.checkOut);
  
            if (isNaN(checkIn) || isNaN(checkOut)) {
              console.warn(`Invalid date format for ${employee.name}`, record);
              return total;
            }
  
            const duration = (checkOut - checkIn) / (1000 * 60 * 60); // Convert to hours
            return total + duration;
          }, 0);
  
          return { ...employee, totalTime: totalTime.toFixed(2) };
        }
        return { ...employee, totalTime: "N/A" };
      });
  
      setEmployees(employeesWithTotalTime);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees by search term and role
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || employee.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Calculate the indices of the current page's employees
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new filter
  };

  return (
    <>
      <div className="container my-5">
        {/* Search and Filter Controls */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        <div className="accordion" id="accordionExample">
          {currentEmployees.map((employee, index) => (
            <div className="accordion-item" key={employee.employeeId}>
              <div className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${employee.employeeId}`}
                  aria-expanded="false"
                  aria-controls={`collapse${employee.employeeId}`}
                >
                  <div className="d-flex flex-column justify-content-center align-items-start">
                    <div className="display-6">{employee.name}</div>
                    <p className="my-0 text-muted">{employee.designation}</p>
                  </div>
                </button>
              </div>
              <div
                id={`collapse${employee.employeeId}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Name: <strong>{employee.name}</strong>
                  </p>
                  <p>
                    <strong>{employee.designation}</strong>
                  </p>
                  <p>
                    Email:{" "}
                    <a className="email text-decoration-none hover-pointer">
                      {employee.email}
                    </a>
                  </p>
                  {employee.role === "admin" ? (
                    <p className="badge text-bg-danger">{employee.role}</p>
                  ) : (
                    ""
                  )}
                <p>
  Total Time: <strong>{employee.totalTime} hours</strong>
</p>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from(
              { length: Math.ceil(filteredEmployees.length / employeesPerPage) },
              (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {filteredEmployees.length > 3 ? (
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ) : (
                    ""
                  )}
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Employees;
