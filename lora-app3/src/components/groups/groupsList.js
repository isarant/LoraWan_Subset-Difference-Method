import React from "react";
import { CardDeck, } from "react-bootstrap";
import Group from "./group"

const GroupsList = ({ groups_list, groups_list_details, groups_list_devices }) => {

  // console.log('GroupsList groups_list');
  // console.log(groups_list);
  // console.log('GroupsList groups_list_details');
  // console.log(groups_list_details);
  // console.log('GroupsList groups_list_devices');
  // console.log(groups_list_devices);
  if (groups_list !== []) {
    return (
      <CardDeck>
        {groups_list.map(mygroup => {
          // console.log('GroupsList mygroup');
          // console.log(mygroup);
          //console.log(groups_list_devices[mygroup.id]);
          return (
            <Group key={mygroup.id} group={mygroup} group_devices={groups_list_devices[mygroup.id]} group_details={groups_list_details[mygroup.id]} />
          );
        })}
      </CardDeck>
    );
  } else {
    return <div> No Groups </div>;
  }
};

export default GroupsList;
