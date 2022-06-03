import * as React from 'react';
import { connect } from 'react-redux';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import {ApplicationState} from '../store';
import * as VehicleStore from '../store/Vehicles';
import {Vehicles} from "../store/Vehicles";
import './vehicleStyles.css';
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody} from "reactstrap";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

type VehicleProps =
    VehicleStore.VehiclesState // ... state we've requested from the Redux store
    & typeof VehicleStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startVehicleIndex: string }>; // ... plus incoming routing parameters

class FetchData extends React.PureComponent<VehicleProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    if (JSON.stringify(this.props.error) === '{}') this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    if (JSON.stringify(this.props.error) === '{}') this.ensureDataFetched();
  }
  
  public state = {
    title: "",
    modalOpen: false,
    vehicle: null,
    make: "",
    model: "",
    year: 0,
    id: 0,
    tempYear: null,
    execute: () => {}
  }
  
  public render() {
    return (
      <React.Fragment>
        
        <h1 id="tabelLabel">Vehicles</h1>

        {(JSON.stringify(this.props.error) === '{}') ? this.renderVehiclesTable() : ''}
        {(JSON.stringify(this.props.error) === '{}') ? this.renderPagination() : ''}
        
        <Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
          <ModalBody>
            <h3>{this.state.title}</h3>
            <Form>
              <FormGroup>
                <Label for="newMake">
                  Make
                </Label>
                <Input
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
                    id="newYear"
                    selected={this.state.tempYear}
                    onChange={(date) => this.setState({ tempYear: date, year: date?.getFullYear() }) }
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Click to Select a Date"
                />
              </FormGroup>
              <Button onClick={this.state.execute}>
                Submit
              </Button>
            </Form>
          </ModalBody>
        </Modal>
        
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
              <tr key={vehicle.id} >
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
      modalOpen: !this.state.modalOpen
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

  private deleteVehicle = (event: React.MouseEvent<SVGElement>, id: number) => {
    event.preventDefault();

    const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
    this.props.deleteVehicle(id, startVehicleIndex);
  };

  private processEditVehicle = (event: React.MouseEvent<SVGElement>, vehicle: Vehicles) => {
    event.preventDefault();

    this.toggle();

    let tempYear = new Date();
    tempYear.setFullYear(vehicle.year);

    this.setState({
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
