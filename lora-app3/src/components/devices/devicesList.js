import React from "react";
import { FaRegTrashAlt, FaRegPaperPlane, FaRegListAlt, FaBitbucket } from "react-icons/fa";
import { ListGroup, Button } from "react-bootstrap";

const DevicesList = ({ device_list, click }) => {

  const mylistdevices = device_list;

  if (mylistdevices !== undefined) {
    return (
      <ListGroup >
        {mylistdevices.map(mydevice => {
          return (
            <ListGroup.Item key={mydevice.devEUI}>
              <div className="float-left">
                DeviceName : {mydevice.name} Device Description : {mydevice.description}
              </div>
              <div className="float-right">
                <Button
                  variant="light"
                  onClick={() => click(mydevice.devEUI, 'DeviceDetails')}
                >
                  <FaRegListAlt />
                </Button>
                <Button
                  variant="light"
                  onClick={() => click(mydevice.devEUI, 'SendDevice')}
                >
                  <FaRegPaperPlane />
                </Button>
                <Button variant="light"
                  onClick={() => click(mydevice.devEUI, 'DeviceQueue')}>
                  <FaBitbucket />
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  } else {
    return <div> No devices </div>;
  }
};

export default DevicesList;
