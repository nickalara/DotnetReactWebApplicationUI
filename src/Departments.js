import React, { Component } from "react";
import { variables } from './Variables';

export class Departments extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //array to pull all department data from db
            departments: [],
            //for modal popups i.e. edit/add records
            modalTitle: "",
            DepartmentID: 0,
            DepartmentName: "",
            IsActive: true,
            ByCreated: "",
            ByUpdated: "",
            DateCreated: "",
            DateUpdated: "",

            //props for filters
            NoFilter: [],
            FilterDepartmentID: "",
            FilterDepartmentName: ""
        }
    }

    //Filter functions
    filterFn() {
        var FilterDepartmentID = this.state.FilterDepartmentID;
        var FilterDepartmentName = this.state.FilterDepartmentName;

        var filteredData = this.state.NoFilter.filter(
            function (el) {
                return el.DepartmentID.toString().toLowerCase().includes(
                    FilterDepartmentID.toString().trim().toLowerCase()
                ) &&
                    el.DepartmentName.toString().toLowerCase().includes(
                        FilterDepartmentName.toString().trim().toLowerCase()
                    )
            }
        );
        this.setState({ departments: filteredData });
    }
    changeDepartmentIDFilter = (e) => {
        this.state.FilterDepartmentID = e.target.value;
        this.filterFn();
    }
    changeDepartmentNameFilter = (e) => {
        this.state.FilterDepartmentName = e.target.value;
        this.filterFn();
    }
    //End Filter functions

    //Sorting functions
    sortResult(prop, ascending) {
        var sortedData = this.state.NoFilter.sort(function (a, b) {
            if (ascending) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0)
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0)
            }
        });
        this.setState({ departments: sortedData })
    };

    refreshList() {
        fetch(variables.API_URL + 'departments')
            .then(response => response.json())
            .then(data => {
                this.setState({ departments: data, NoFilter: data })
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    //funcs to change fields
    changeDepartmentName = (input) => {
        this.setState({ DepartmentName: input.target.value });
    }
    //Note to self: add other fields for Departments later

    // Begin buttons in modal functionality
    addClick() {
        this.setState({
            modalTitle: "Add Department",
            DepartmentID: 0,
            DepartmentName: ""
        });
    }
    editClick(dep) {
        this.setState({
            modalTitle: "Edit Department",
            DepartmentID: dep.DepartmentID,
            DepartmentName: dep.DepartmentName
        });
    }
    createClick() {
        fetch(variables.API_URL + 'department', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DepartmentName: this.state.DepartmentName
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Create department record failed.');
            })
    }
    updateClick() {
        fetch(variables.API_URL + 'department', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DepartmentID: this.state.DepartmentID,
                DepartmentName: this.state.DepartmentName
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Edit department record failed.');
            })
    }
    deleteClick(id) {
        if (window.confirm('Are you sure you want to delete this department record?')) {
            fetch(variables.API_URL + 'department' + id, {
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
                    alert('Delete department record failed.');
                })
        }
    }
    // End buttons in modal functionality

    render() {
        const {
            departments,
            modalTitle,
            DepartmentID,
            DepartmentName,
            // Note to self: Add these in later
            // IsActive,
            // ByCreated,
            // ByEdited,
            // DateCreated,
            // DateEdited
        } = this.state;

        return (
            <div>
                <button
                    type="button"
                    className="btn btn-primary m-2 float-end"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    Add Department
                </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                Department ID
                                <div className="d-flex flex-row">
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
                                </div>
                            </th>
                            <th>
                                Department Name
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2"
                                        onChange={this.changeDepartmentNameFilter}
                                        placeholder="Filter by Name" />
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('DepartmentName', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                            <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                        </svg>
                                    </button>
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('DepartmentName', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                                            <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                                        </svg>
                                    </button>
                                </div>

                            </th>
                            <th>IsActive</th>
                            <th>Created By</th>
                            <th>Updated By</th>
                            <th>Date Created</th>
                            <th>Date Updated</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dep =>
                            <tr key={dep.DepartmentID}>
                                <td>{dep.DepartmentID}</td>
                                <td>{dep.DepartmentName}</td>
                                <td>{dep.IsActive}</td>
                                <td>{dep.ByCreated}</td>
                                <td>{dep.ByEdited}</td>
                                <td>{dep.DateCreated}</td>
                                <td>{dep.DateEdited}</td>
                                <td>
                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(dep)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                    </button>
                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        onClick={() => this.deleteClick(dep.DepartmentID)}>
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
                                <div className="input-group mb-3">
                                    <span className="input-group-text">DepartmentName</span>
                                    <input type="text" className="form-control"
                                        value={DepartmentName}
                                        onChange={this.changeDepartmentName} />
                                </div>

                                {DepartmentID === 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.createClick()}
                                    >Create</button>
                                    : null}
                                {DepartmentID !== 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.updateClick()}
                                    >Update</button>
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}