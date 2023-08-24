import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";


class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkvalue: 2,
        }

    }

    onChange(event) {
        this.setState({ checkvalue: event.target.value });
    }

    buttonsendclick = id => {
        if (document.getElementById("message").value !== "") {
            if (!this.props.nnl) {
                this.props.sendmessage(id, btoa(document.getElementById("message").value), document.getElementById("confirmed").checked, document.getElementById("port").value);
                //alert(document.getElementById("message").value + " " + btoa(document.getElementById("message").value));
            }
            else {
                this.props.sendmessagennl(document.getElementById("message").value);
            }
            this.props.onHide();
        }
        else
            alert("Please write a text");
    }



    render() {
        const { id, name, show, } = this.props;
        console.log('SendMessage');
        console.log(id);
        console.log(show);
        if (id !== undefined) {
            return (
                <Modal
                    show={show}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Send Message to {name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group >
                                <Form.Label>Message</Form.Label>
                                <Form.Control id="message" as="textarea" rows="3" />
                            </Form.Group>
                            {!this.props.nnl ?
                                <Form.Group>
                                    <Form.Label>Port</Form.Label>

                                    <Form.Control id="port" as="input" type="number" min="1" max="5" value={this.state.checkvalue}
                                        onChange={this.onChange.bind(this)} />
                                    <Form.Check id="confirmed" /> Confirmed Message
                                </Form.Group>
                                :

                                ""
                            }
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.buttonsendclick(id)} > Send</Button>
                        <Button onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal >
            )
        } else {
            return <div />;
        }
    }
}

export default SendMessage;
