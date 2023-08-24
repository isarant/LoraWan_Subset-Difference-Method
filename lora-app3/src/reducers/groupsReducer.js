import { groupsConstants } from "../constants/groups.constants";
let initStore = {
    groups_list: [],
    groups_list_devices: {},
    groups_list_details: {},
    groupQueueItems: [],
    groups_offset: 0,
    groups_total_count: 0,
    group: {},
};

export default function (state = initStore, action) {

    switch (action.type) {
        case groupsConstants.GROUPS_SUCCESS:
            return {
                ...state,
                groups_list: action.groups.result,
                groups_total_count: action.groups.totalCount,
                group: {}
            };
        case groupsConstants.GET_GROUP_DETAILS_SUCCESS:
            return {
                ...state,
                groups_list_details: { ...state.groups_list_details, [action.group_id]: action.group_details }
            };
        case groupsConstants.GET_DEVICE_FROM_GROUP_SUCCESS:
            //console.log('action.group_list_devices');
            //console.log(action.group_list_devices);
            //console.log('state.group_list_devices');
            //console.log(state.groups_list_devices);
            return {
                ...state,
                groups_list_devices: { ...state.groups_list_devices, [action.group_id]: action.group_list_devices }
            };
        case groupsConstants.GET_QUEUE_GROUP_SUCCESS:
            return {
                ...state,
                groupQueueItems: action.group_queue_items
            }
        default:
            return {
                ...state
            };
    }
}  