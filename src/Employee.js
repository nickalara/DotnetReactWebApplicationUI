import React, { Component } from "react";
import { variables } from './Variables';

export class Employee extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //need departments array for dropdown in Modal
            departments: [],
            //array for employees data from db
            employees: [],
            //for modal popups i.e. edit/add records
            modalTitle: "",
            EmployeeID: 0,
            FirstName: "",
            LastName: "",
            DepartmentID: 0,
            HireDate: 0,
            Picture: "",
            PicturePath: variables.PHOTO_URL,
            IsActive: true,
            ByCreated: "",
            ByUpdated: "",
            DateCreated: "",
            DateUpdated: "",

            //props for filters
            NoFilter: [],
            FilterDepartmentID: "",
            FilterEmployeeID: "",
            FilterFirstName: "",
            FilterLastName: ""
        }
    }

    //Filter functions
    filterFn() {
        var FilterDepartmentID = this.state.FilterDepartmentID;
        var FilterEmployeeID = this.state.FilterEmployeeID;
        var FilterFirstName = this.state.FilterFirstName;
        var FilterLastName = this.state.FilterLastName;

        var filteredData = this.state.NoFilter.filter(
            function (el) {
                return el.DepartmentID.toString().toLowerCase().includes(
                    FilterDepartmentID.toString().trim().toLowerCase()
                ) &&
                    el.EmployeeID.toString().toLowerCase().includes(
                        FilterEmployeeID.toString().trim().toLowerCase()
                    ) &&
                    el.FirstName.toString().toLowerCase().includes(
                        FilterFirstName.toString().trim().toLowerCase()
                    ) &&
                    el.LastName.toString().toLowerCase().includes(
                        FilterLastName.toString().trim().toLowerCase()
                    )
            }
        );
        this.setState({ employees: filteredData });
    }
    changeDepartmentIDFilter = (e) => {
        this.state.FilterDepartmentID = e.target.value;
        this.filterFn();
    }
    changeEmployeeIDFilter = (e) => {
        this.state.FilterEmployeeID = e.target.value;
        this.filterFn();
    }
    changeFirstNameFilter = (e) => {
        this.state.FilterFirstName = e.target.value;
        this.filterFn();
    }
    changeLastNameFilter = (e) => {
        this.state.FilterLastName = e.target.value;
        this.filterFn();
    }
    //End Filter functions

    //Sorting function
    sortResult(prop, ascending) {
        var sortedData = this.state.NoFilter.sort(function (a, b) {
            if (ascending) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0)
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0)
            }
        });
        this.setState({ employees: sortedData })
    };

    refreshList() {
        fetch(variables.API_URL + 'employee')
            .then(response => response.json())
            .then(data => {
                this.setState({ employees: data })
            });
        fetch(variables.API_URL + 'departments')
            .then(response => response.json())
            .then(data => {
                this.setState({ departments: data })
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    //funcs to change fields
    changeEmployeeID = (input) => {
        this.setState({ EmployeeID: input.target.value });
    }
    changeFirstName = (input) => {
        this.setState({ FirstName: input.target.value });
    }
    changeLastName = (input) => {
        this.setState({ LastName: input.target.value });
    }
    changeDepartmentID = (input) => {
        this.setState({ DepartmentID: input.target.value });
    }
    changeHireDate = (input) => {
        this.setState({ HireDate: input.target.value });
    }
    changeIsActive = (input) => {
        this.setState({ IsActive: input.target.value });
    }
    changeByCreated = (input) => {
        this.setState({ ByCreated: input.target.value });
    }
    changeByUpdated = (input) => {
        this.setState({ ByUpdated: input.target.value });
    }
    changeDateCreated = (input) => {
        this.setState({ DateCreated: input.target.value });
    }
    changeDateUpdated = (input) => {
        this.setState({ DateUpdated: input.target.value });
    }
    //May need to fix changeIsActive^^^
    //Note to self: add other fields for Employee later

    //Begin buttons in modal functionality
    addClick() {
        this.setState({
            modalTitle: "Add Employee",
            EmployeeID: 0,
            FirstName: "",
            LastName: "",
            DepartmentID: "",
            HireDate: "",
            Picture: "tux.jfif"
        });
    }
    editClick(emp) {
        this.setState({
            modalTitle: "Edit Employee",
            EmployeeID: emp.EmployeeID,
            FirstName: emp.FirstName,
            LastName: emp.LastName,
            DepartmentID: emp.DepartmentID,
            HireDate: emp.HireDate,
            Picture: emp.Picture
        });
    }
    createClick() {
        fetch(variables.API_URL + 'employee', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeID: this.state.EmployeeID,
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                DepartmentID: this.state.DepartmentID,
                HireDate: this.state.HireDate,
                Picture: this.state.Picture,
                IsActive: this.state.IsActive,
                ByCreated: this.state.ByCreated,
                ByUpdated: this.state.ByUpdated,
                DateCreated: this.state.DateCreated,
                DateUpdated: this.state.DateUpdated
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Create employee record failed.');
            })
    }
    updateClick() {
        fetch(variables.API_URL + 'employee', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                DepartmentID: this.state.DepartmentID,
                HireDate: this.state.HireDate,
                Picture: this.state.Picture
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Edit employee record failed.');
            })
    }
    deleteClick(id) {
        if (window.confirm('Are you sure you want to delete this employee record?')) {
            fetch(variables.API_URL + 'employee/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((result) => {
                    alert(result);
                    this.refreshList();
                }, (error) => {
                    alert('Delete employee record failed.');
                })
        }
    }
    //function to upload images
    imageUpload = (input) => {
        input.preventDefault();

        const formData = new FormData();
        formData.append("file", input.target.files[0], input.target.files[0].name);

        fetch(variables.API_URL + 'employee/savefile', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ Picture: data });
            })
    }
    //End buttons in modal functionality

    render() {
        const {
            departments,
            employees,
            modalTitle,
            EmployeeID,
            FirstName,
            LastName,
            DepartmentID,
            // Note to self: Add these in later
            HireDate,
            PicturePath,
            Picture,
            IsActive,
            ByCreated,
            ByEdited,
            DateCreated,
            DateUpdated
        } = this.state;

        return (
            <div>
                <button
                    type="button"
                    className="btn btn-primary m-2 float-end"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    Add Employee
                </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                Employee ID
                                {/* <div className="d-flex flex-row">
                                    <input className="form-control m-2"
                                        onChange={this.changeEmployeeIDFilter}
                                        placeholder="Filter by ID" />
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('EmployeeID', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                            <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                        </svg>
                                    </button>
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('EmployeeID', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                                            <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                        </svg>
                                    </button>
                                </div> */}
                            </th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>
                                Department ID
                                {/* <div className="d-flex flex-row">
                                    <input className="form-control m-2"
                                        onChange={this.changeDepartmentIDFilter}
                                        placeholder="Filter by ID" />
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('DepartmentID', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                            <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                        </svg>
                                    </button>
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('DepartmentID', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                                            <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                        </svg>
                                    </button>
                                </div> */}
                            </th>
                            <th>Hire Date</th>
                            <th>IsActive</th>
                            <th>Created By</th>
                            <th>Updated By</th>
                            <th>Date Created</th>
                            <th>Date Updated</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp =>
                            <tr key={emp.EmployeeID}>
                                <td>{emp.EmployeeID}</td>
                                <td>{emp.FirstName}</td>
                                <td>{emp.LastName}</td>
                                <td>{emp.DepartmentID}</td>
                                <td>{emp.HireDate}</td>
                                <td>{emp.IsActive}</td>
                                <td>{emp.ByCreated}</td>
                                <td>{emp.ByUpdated}</td>
                                <td>{emp.DateCreated}</td>
                                <td>{emp.DateUpdated}</td>
                                <td>
                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(emp)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                    </button>
                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        onClick={() => this.deleteClick(emp.EmployeeID)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div className="modal-body">
                                <div className="d-flex flex-row bd-highlight mb-3">
                                    <div className="p-2 w-50 bd-highlight">

                                        <div className="input-group mb-3">
                                            <span className="input-group-text">First Name</span>
                                            <input type="text" className="form-control"
                                                value={FirstName}
                                                onChange={this.changeFirstName} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Last Name</span>
                                            <input type="text" className="form-control"
                                                value={LastName}
                                                onChange={this.changeLastName} />
                                        </div>
                                        {/* Need to fix EmployeeID update on backend */}
                                        {/* <div className="input-group mb-3">
                                            <span className="input-group-text">Employee ID</span>
                                            <input type="number" className="form-control"
                                                value={EmployeeID}
                                                onChange={this.changeEmployeeID} />
                                        </div> */}
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">DepartmentID</span>
                                            <select className="form-select"
                                                onChange={this.changeDepartmentID}
                                                value={DepartmentID}>
                                                {departments.map(dep => <option key={dep.DepartmentID}>
                                                    {dep.DepartmentID}
                                                </option>)}
                                            </select>
                                        </div>
                                        {/* <div className="input-group mb-3">
                                            <span className="input-group-text">Department ID</span>
                                            <input type="text" className="form-control"
                                                value={DepartmentID}
                                                onChange={this.changeDepartmentID} />
                                        </div> */}

                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Hire Date</span>
                                            <input type="date" className="form-control"
                                                value={HireDate}
                                                onChange={this.changeHireDate} />
                                        </div>

                                        <div className="input-group mb-3">
                                            <div className="btn-group" role="group" aria-label="IsActive toggle">
                                                <input type="checkbox"
                                                    className="btn-check"
                                                    id="ActiveToggle"
                                                    autoComplete="off"
                                                    value={IsActive}
                                                    onChange={this.changeIsActive} />
                                                {/* Fix the active toggle to be equal to the IsActive */}
                                                <label className="btn btn-outline-primary" htmlFor="ActiveToggle">Is Active?</label>
                                            </div>
                                        </div>
                                        {/* Add in the rest of the employee fields */}

                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Created By</span>
                                            <input type="text" className="form-control"
                                                value={ByCreated}
                                                onChange={this.changeByCreated} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Updated By</span>
                                            <input type="text" className="form-control"
                                                value={ByEdited}
                                                onChange={this.changeByUpdated} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Date Created</span>
                                            <input type="date" className="form-control"
                                                value={DateCreated}
                                                onChange={this.changeDateCreated} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Date Updated</span>
                                            <input type="date" className="form-control"
                                                value={DateUpdated}
                                                onChange={this.changeDateUpdated} />
                                        </div>
                                        <div className="p-2 w-50 bd-highlight">
                                            <img width="250px" height="250px"
                                                src={PicturePath + Picture}
                                                alt={FirstName + " " + LastName} />
                                            <input className="m-2" type="file" onChange={this.imageUpload} />
                                        </div>
                                    </div>
                                </div>
                                {EmployeeID === 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.createClick()}
                                    >Create</button>
                                    : null}
                                {EmployeeID !== 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.updateClick()}
                                    >Update</button>
                                    : null}
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}