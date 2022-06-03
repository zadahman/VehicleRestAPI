import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {act} from "react-dom/test-utils";

export interface VehiclesState {
    isLoading: boolean;
    startVehicleIndex?: number;
    vehicles: Vehicles[];
    error: object;
}

export interface Vehicles {
    id: number;
    make: string;
    model: string;
    year: number;
}

// actions are getAll, getSpecific, update, create, and delete
interface GetAllVehiclesAction {
    type: 'GET_ALL_VEHICLES';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface CreateVehicleAction {
    type: 'CREATE_VEHICLE';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface GetOneVehicleAction {
    type: 'GET_ONE_VEHICLE';
    startVehicleIndex: number;
    tempVehicle: Vehicles[];
}

interface UpdateVehicleAction {
    type: 'UPDATE_VEHICLE';
    startVehicleIndex: number;
    isUpdated: boolean;
    vehicles: Vehicles[];
}

interface DeleteVehicleAction {
    type: 'DELETE_VEHICLE';
    startVehicleIndex: number;
    vehicles: Vehicles[];
    isDeleted: boolean;
}

interface RequestVehicleAction {
    type: 'REQUEST_VEHICLES';
    startVehicleIndex: number;
}

interface ErrorOccurredAction {
    type: 'ERROR_OCCURRED';
    error: object;
}

type Actions = GetAllVehiclesAction | CreateVehicleAction | GetOneVehicleAction | UpdateVehicleAction | DeleteVehicleAction | RequestVehicleAction | ErrorOccurredAction;

export const actionCreators = {
    requestVehicles: (startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles && startVehicleIndex !== appState.vehicles.startVehicleIndex) {
            fetch(`api/Vehicle`)
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'GET_ALL_VEHICLES', startVehicleIndex: startVehicleIndex, vehicles: data });
                });
            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    createVehicle: (newVehicle: Vehicles, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles) {
            const currentVehicles = appState.vehicles.vehicles;
            
            fetch(`api/Vehicle`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            })
                .then(response => response.json() as Promise<Vehicles>)
                .then(data => {
                    newVehicle.id = data.id;
                    currentVehicles.push(newVehicle);
                    if (JSON.stringify(appState?.vehicles?.error) === '{}') {
                        dispatch({
                            type: 'CREATE_VEHICLE',
                            startVehicleIndex: startVehicleIndex,
                            vehicles: currentVehicles
                        });
                    }
                })
                .catch(error => {
                    console.log(error.title);
                    dispatch({ type: 'ERROR_OCCURRED', error: error.errors });
                    console.log("ok "+JSON.stringify(error));
                    alert("test");
                });
            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    getOneVehicle: (id: number, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle/${id}`)
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'GET_ONE_VEHICLE', startVehicleIndex: startVehicleIndex, tempVehicle: data });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    updateVehicle: (newVehicle: Vehicles, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            })
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'UPDATE_VEHICLE', startVehicleIndex: startVehicleIndex, isUpdated: true, vehicles: data });
                })
                .catch((error) => {
                    dispatch({ type: 'ERROR_OCCURRED', error: error.errors });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    deleteVehicle: (id: number, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle/${id}`,{
                method: 'DELETE',
            })
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'DELETE_VEHICLE', startVehicleIndex: startVehicleIndex, isDeleted: true, vehicles: data });
                })
                .catch((error) => {
                    dispatch({ type: 'ERROR_OCCURRED', error: error.errors });
                });
            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    }
};

const unloadedState: VehiclesState = { vehicles: [], isLoading: false, error: {} };

export const reducer: Reducer<VehiclesState> = (state: VehiclesState | undefined, incomingAction: Action): VehiclesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as Actions;
    switch (action.type) {
        case 'REQUEST_VEHICLES':
            return {
                vehicles: state.vehicles,
                isLoading: true,
                startVehicleIndex: action.startVehicleIndex,
                error: {}
            };
        case 'GET_ALL_VEHICLES':
        case 'CREATE_VEHICLE':
            if (action.startVehicleIndex === state.startVehicleIndex) {
                return {
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    isLoading: false,
                    error: {}
                };
            }
            break;
        case "GET_ONE_VEHICLE":
            break;
        case "UPDATE_VEHICLE":
            if (action.isUpdated) {
                return {
                    isLoading: false,
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    error: {}
                };
            }
            break;
        case 'DELETE_VEHICLE':
            if (action.isDeleted) {
                return {
                    isLoading: false,
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    error: {}
                };
            }
            break;
        case "ERROR_OCCURRED":
            return {
                isLoading: false, 
                startVehicleIndex: state.startVehicleIndex,
                vehicles: state.vehicles,
                error: action.error
            };
    }

    return state;
};
