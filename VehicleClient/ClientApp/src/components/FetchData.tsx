import * as React from 'react';
import { connect } from 'react-redux';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import {ApplicationState} from '../store';
import * as VehicleStore from '../store/Vehicles';
import {Vehicles} from "../store/Vehicles";
import './vehicleStyles.css';
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter} from "reactstrap";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

type VehicleProps =
    VehicleStore.VehiclesState // ... state we've requested from the Redux store
    & typeof VehicleStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startVehicleIndex: string }>; // ... plus incoming routing parameters

class FetchData extends React.PureComponent<VehicleProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
    
    this.ensureView();
  }
  
  public state = {
    title: "",
    view: false,
    modalOpen: false,
    vehicle: null,
    make: "",
    model: "",
    year: 0,
    id: 0,
    tempYear: null,
    disableButton: false,
    execute: () => {}
  }
  
  public render() {
    return (
      <React.Fragment>
        
        <h1 id="tabelLabel">Vehicles</h1>

        {(JSON.stringify(this.props.error) === '{}') ? this.renderVehiclesTable() : ''}
        {(JSON.stringify(this.props.error) === '{}') ? this.renderPagination() : ''}
        
        <div>
          <Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
            <ModalHeader>
              {this.state.title}
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="newMake">
                    Make
                  </Label>
                  <Input
                      disabled={this.state.disableButton}
                      id="newMake"
                      name="newMake"
                      placeholder="Enter Vehicle Make"
                      type="text"
                      value={this.state.make}
                      onChange={(event) => this.setState({ make: event.target.value }) }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="newModel">
                    Model
                  </Label>
                  <Input
                      disabled={this.state.disableButton}
                      id="newModel"
                      name="newModel"
                      placeholder="Enter Vehicle Model"
                      type="text"
                      value={this.state.model}
                      onChange={(event) => this.setState({ model: event.target.value  }) }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="newYear">
                    Year
                  </Label>
                  <DatePicker
                      disabled={this.state.disableButton}
                      id="newYear"
                      selected={this.state.tempYear}
                      onChange={(date) => this.setState({ tempYear: date, year: date?.getFullYear() }) }
                      showYearPicker
                      dateFormat="yyyy"
                      placeholderText="Click to Select a Date"
                  />
                </FormGroup>
                <ModalFooter>
                  <Button disabled={this.state.disableButton} onClick={this.state.execute}>
                    Submit
                  </Button>
                </ModalFooter>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
  
  private ensureDataFetched() {
    const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
    this.props.requestVehicles(startVehicleIndex);
  }

  private renderVehiclesTable() {
    return (
        <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th> <Button className="btn btn-primary" onClick={(e) => this.processCreateVehicle(e)}> Create New Vehicle </Button> </th>
          </tr>
        </thead>
        <tbody>
          {this.props.vehicles.map((vehicle: VehicleStore.Vehicles) =>
              <tr key={vehicle.id} onClick={(e) => this.viewVehicle(e, vehicle.id)}>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td id="tableIcons"> <FaEdit
                         onClick={(e) => this.processEditVehicle(e, vehicle)}
                     /> 
                     <FaTrashAlt
                         onClick={(e) => this.deleteVehicle(e, vehicle.id)}
                     /> 
                </td>
              </tr>
          )}
        </tbody>
      </table>
    );
  }

  private toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      disableButton: !this.state.view
    });
  }

  private renderPagination() {
    const prevStartVehicleIndex = (this.props.startVehicleIndex || 0) - 5;
    const nextStartVehicleIndex = (this.props.startVehicleIndex || 0) + 5;

    return (
      <div className="d-flex justify-content-between">
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartVehicleIndex}`}>Previous</Link>
        {this.props.isLoading && <span>Loading...</span>}
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartVehicleIndex}`}>Next</Link>
      </div>
    );
  }

  private ensureView() {
    if (this.state.modalOpen && this.state.view) {
      let selectedVehicle = this.props.selectedVehicle;
      if (selectedVehicle.id != null && selectedVehicle.id != this.state.id && this.state.disableButton) {
        let tempYear = new Date();
        tempYear.setFullYear(selectedVehicle.year);

        this.setState({
          title: `Viewing Vehicle ${selectedVehicle.id}`,
          make: selectedVehicle.make,
          model: selectedVehicle.model,
          tempYear: tempYear,
          view: false,
          id: selectedVehicle.id
        });
      }
    }
  }
  
  private viewVehicle =  (event: React.MouseEvent<HTMLTableRowElement>, id: number) => {
    event.preventDefault();

    this.setState({
      view: true
    });
    
    this.toggle();
    
    const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
    this.props.getOneVehicle(id, startVehicleIndex);
    this.forceUpdate();
  };

  private deleteVehicle = (event: React.MouseEvent<SVGElement>, id: number) => {
    event.preventDefault();
    event.stopPropagation();

    const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
    this.props.deleteVehicle(id, startVehicleIndex);
  };

  private processEditVehicle = (event: React.MouseEvent<SVGElement>, vehicle: Vehicles) => {
    event.preventDefault();
    event.stopPropagation();

    this.toggle();

    let tempYear = new Date();
    tempYear.setFullYear(vehicle.year);

    this.setState({
      disableButton: false,
      title: `Editing Vehicle ${vehicle.id}`,
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      tempYear: tempYear,
      execute: (e: React.MouseEvent<HTMLButtonElement>) => this.editCreateVehicle(e, "edit")
    });
  };
  
  private processCreateVehicle(event: React.MouseEvent<SVGElement>) {
    event.preventDefault();
    
    this.toggle();

    this.setState({
      make: "",
      model: "",
      year: 0,
      id: 0,
      tempYear: null,
      disableButton: false,
      title: `Create New Vehicle`,
      execute: (e: React.MouseEvent<HTMLButtonElement>) => this.editCreateVehicle(e, "create")
    });
  }

  private editCreateVehicle = (event: React.MouseEvent<HTMLButtonElement>, opType: string) => {
    event.preventDefault();

    let vehicle = {
      id: this.state.id,
      make: this.state.make,
      model: this.state.model,
      year: this.state.year,
    }

    const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
    if (opType === "edit") {
      this.props.updateVehicle(vehicle, startVehicleIndex);
    }
    else if (opType === "create") {
      this.props.createVehicle(vehicle, startVehicleIndex);
    }

    this.toggle();
  };
}

export default connect(
    (state: ApplicationState) => state.vehicles, // Selects which state properties are merged into the component's props
    VehicleStore.actionCreators // Selects which action creators are merged into the component's props
)(FetchData as any); // eslint-disable-line @typescript-eslint/no-explicit-any
