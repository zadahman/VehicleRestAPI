import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface VehiclesState {
    isLoading: boolean;
    startVehicleIndex?: number;
    vehicles: Vehicles[];
    selectedVehicle: Vehicles;
    error: boolean;
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
    tempVehicle: Vehicles;
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
    error: boolean;
}

type Actions = GetAllVehiclesAction | CreateVehicleAction | GetOneVehicleAction | UpdateVehicleAction | DeleteVehicleAction | RequestVehicleAction | ErrorOccurredAction;

function handleError(error: any, dispatch: any) {
    dispatch({ type: 'ERROR_OCCURRED', error: true });
    let errorMessage = error.title;

    if (error.errors.Make !== undefined) {
        errorMessage = errorMessage.concat( "\n", error.errors.Make[0]);
    }

    if (error.errors.Model !== undefined) {
        errorMessage = errorMessage.concat( "\n", error.errors.Model[0]);
    }

    if (error.errors.Year !== undefined) {
        errorMessage = errorMessage.concat( "\n", error.errors.Year[0]);
    }

    alert(errorMessage);
}

export const actionCreators = {
    requestVehicles: (startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles && startVehicleIndex !== appState.vehicles.startVehicleIndex) {
            fetch(`api/Vehicle`)
                .then(response => response.json())
                .then(data => {
                    if (data.errors == null) {
                        let newData  = data as Vehicles[];
                        dispatch({ type: 'GET_ALL_VEHICLES', startVehicleIndex: startVehicleIndex, vehicles: newData });
                    }
                    else {
                        handleError(data, dispatch);
                    }
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
                .then(response => response.json())
                .then(data => {
                    if (data.errors == null) {
                        let newData  = data as Vehicles;
                        currentVehicles.push(newData);
                        dispatch({type: 'CREATE_VEHICLE', startVehicleIndex: startVehicleIndex, vehicles: currentVehicles});
                    }
                    else {
                        handleError(data, dispatch);
                    }
                })
            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    getOneVehicle: (id: number, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.errors == null) {
                        let newData  = data as Vehicles;
                        dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
                        dispatch({ type: 'GET_ONE_VEHICLE', startVehicleIndex: startVehicleIndex, tempVehicle: newData });
                    }
                    else {
                        handleError(data, dispatch);
                    }
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
                .then(response => response.json() )
                .then(data => {
                    if (data.errors == null) {
                        let newData  = data as Vehicles[];
                        dispatch({ type: 'UPDATE_VEHICLE', startVehicleIndex: startVehicleIndex, isUpdated: true, vehicles: newData });
                    }
                    else {
                        handleError(data, dispatch);
                    }
                })
            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    deleteVehicle: (id: number, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle/${id}`,{
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.errors == null) {
                        let newData  = data as Vehicles[];
                        dispatch({ type: 'DELETE_VEHICLE', startVehicleIndex: startVehicleIndex, isDeleted: true, vehicles: newData });
                    }
                    else {
                        handleError(data, dispatch);
                    }
                })
            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    }
};

const unloadedState: VehiclesState = {selectedVehicle: {} as Vehicles, vehicles: [], isLoading: false, error: false };

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
                selectedVehicle: state.selectedVehicle,
                startVehicleIndex: action.startVehicleIndex,
                error: state.error
            };
        case 'GET_ALL_VEHICLES':
        case 'CREATE_VEHICLE':
            if (action.startVehicleIndex === state.startVehicleIndex) {
                return {
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    selectedVehicle: {} as Vehicles,
                    isLoading: false,
                    error: state.error
                };
            }
            break;
        case "GET_ONE_VEHICLE":
            return {
                startVehicleIndex: action.startVehicleIndex,
                vehicles: state.vehicles,
                selectedVehicle: action.tempVehicle,
                isLoading: false,
                error: state.error
            };
        case "UPDATE_VEHICLE":
            if (action.isUpdated) {
                return {
                    isLoading: false,
                    selectedVehicle: {} as Vehicles,
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    error: state.error
                };
            }
            break;
        case 'DELETE_VEHICLE':
            if (action.isDeleted) {
                return {
                    isLoading: false,
                    selectedVehicle: {} as Vehicles,
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    error: state.error
                };
            }
            break;
        case "ERROR_OCCURRED":
            return {
                isLoading: false,
                selectedVehicle: {} as Vehicles,
                startVehicleIndex: state.startVehicleIndex,
                vehicles: state.vehicles,
                error: action.error
            };
    }

    return state;
};
