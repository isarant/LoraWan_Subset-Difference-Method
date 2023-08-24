import React, { Component } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

class ShowQueue extends Component {
    render() {
        const { show, getQueueMessage, id, name, onHide } = this.props;
        if (getQueueMessage) {
            console.log(this.props.deviceQueueItems)
            return (
                <Modal
                    show={show}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header >
                        <Modal.Title id="contained-modal-title-vcenter">
                            Queue Message to {name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            {
                                (getQueueMessage.length > 0) ?
                                    getQueueMessage.map((item, key) =>
                                        (
                                            <ListGroup.Item key={key}>
                                                {item.confirmed ? "confirmed :$(item.confirmed)" : ""}
                                                data : {item.data}
                                                fPort : {item.fPort}
                                                devEUI : {item.devEUI}
                                                {item.jsonObject ? "jsonObject : $(item.jsonObject)" : ""}
                                            </ListGroup.Item>
                                        )) :
                                    <ListGroup.Item> No Items in Queue</ListGroup.Item>
                            }
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { onHide(); }}>Close</Button>
                    </Modal.Footer>
                </Modal >

            )
        } else {
            return <div />;
        }
    }

}
export default ShowQueue;
