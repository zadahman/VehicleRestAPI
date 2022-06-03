import * as React from 'react';
import { connect } from 'react-redux';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import {ApplicationState, AppThunkAction} from '../store';
import * as VehicleStore from '../store/Vehicles';
import MyModal from './MyModal';

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
  }
  
  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Vehicles</h1>         
        
        {this.renderForecastsTable()}
        {this.renderPagination()}
         
          
      </React.Fragment>
    );
  }
  
  private ensureDataFetched() {
    const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
    this.props.requestVehicles(startVehicleIndex);
  }

  private renderForecastsTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th> <MyModal {...this.props}/> </th>
          </tr>
        </thead>
        <tbody>
          {this.props.vehicles.map((vehicle: VehicleStore.Vehicles) =>
              <tr key={vehicle.id}>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td> <FaEdit
                        onClick={() => {alert("testing");}}
                     /> 
                     <FaTrashAlt 
                     /> 
                </td>
              </tr>
          )}
        </tbody>
      </table>
    );
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
}

export default connect(
    (state: ApplicationState) => state.vehicles, // Selects which state properties are merged into the component's props
    VehicleStore.actionCreators // Selects which action creators are merged into the component's props
)(FetchData as any); // eslint-disable-line @typescript-eslint/no-explicit-any
