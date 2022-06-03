import * as React from 'react';
import {Button, Modal, ModalBody, Form, FormGroup, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker';
import * as VehicleStore from "../store/Vehicles";
import {RouteComponentProps} from "react-router";
import 'react-datepicker/dist/react-datepicker.css';

type VehicleProps =
    VehicleStore.VehiclesState // ... state we've requested from the Redux store
    & typeof VehicleStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startVehicleIndex: string }>; // ... plus incoming routing parameters

export default class MyModal extends React.PureComponent<VehicleProps, { isOpen: boolean, toggle: () => void, newYear: Date | null }> {
    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    
    public state = {
        isOpen: false,
        toggle: this.toggle,
        newYear: new Date()
    };

    public render() {
        return (
            <div>
            <Button className="btn btn-primary" onClick={this.toggle}>
                Create New Vehicle
            </Button>
            <div>
                <Modal isOpen={this.state.isOpen} toggle={this.toggle}>
                    <ModalBody>
                        <p>This is the content.</p>
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
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="newYear">
                                    Year
                                </Label>
                                <DatePicker
                                    selected={this.state.newYear}
                                    onChange={(date) => this.setState({ newYear: date }) }
                                    showYearPicker
                                    dateFormat="yyyy"
                                    yearItemNumber={9}
                                />
                            </FormGroup>
                            <Button onClick={this.functionToExecute}>
                                Submit
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
            </div>
        );
    }
    
    private functionToExecute = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        let inputModel = (document.getElementById("newModel") as HTMLInputElement).value;
        let inputMake = (document.getElementById("newMake") as HTMLInputElement).value;
        // @ts-ignore
        let inputYear = this.state.newYear === null ? new Date().getFullYear() : this.state.newYear.getFullYear();

        let vehicles = {
            id: 0,
            make: inputMake,
            model: inputModel,
            year: inputYear
        };

        const startVehicleIndex = parseInt(this.props.match.params.startVehicleIndex, 10) || 0;
        this.props.createVehicle(vehicles, startVehicleIndex);
        this.toggle();
    };
}