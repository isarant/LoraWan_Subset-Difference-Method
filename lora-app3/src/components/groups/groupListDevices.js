import React from 'react';
import { Table, Form } from "react-bootstrap";
import { FaRegTrashAlt, FaRegPaperPlane, FaRegListAlt } from "react-icons/fa";

var InvokeList = [];
var varonChangeInvokeList;

const oncheck = (event) => {
    if (event.target.checked)
        InvokeList.push(event.target.name);
    else
        InvokeList = InvokeList.filter(val => event.target.name !== val);
    varonChangeInvokeList(InvokeList);
}

const devicesrows = (group_devices, onChangeInvokeList) => {
    if (group_devices)
        return group_devices.map(device => (
            <tr key={device.id}>
                <td >
                    {device.name} - {device.description}
                </td>
                <td>
                    <Form.Check name={device.description} onChange={oncheck.bind(this)} />
                </td>
            </tr>
        ))
}
const GroupListDevises = ({ group_devices, onChangeInvokeList }) => {
    varonChangeInvokeList = onChangeInvokeList
    return (
        <Form>
            <Table bordered responsive="sm">
                <tbody>
                    {devicesrows(group_devices)}
                </tbody>
            </Table>
        </Form>

    );

}

export default GroupListDevises;