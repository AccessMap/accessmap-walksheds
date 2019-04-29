import { combineReducers } from "redux";
import {
  GET_REACHABLE,
  SET_TRAVEL_MODE,
  SET_WALKTIME,
} from "./actions";

const defaults = {
  travelMode: "Manual wheelchair",
  walkshed: null,
  walktime: 300,
};

const handleWalkshed = (state = defaults.walkshed, action) => {
  switch (action.type) {
    case GET_REACHABLE:
      return {
        ...state,
        lon: action.payload.lon,
        lat: action.payload.lat,
        reachable: action.payload.reachable,
      };
    default:
      return state;
  }
};

const handleWalktime = (state = defaults.walktime, action) => {
  switch (action.type) {
    case SET_WALKTIME:
      return action.payload;
    default:
      return state;
  }
};

const handleTravelMode = (state = defaults.travelMode, action) => {
  switch (action.type) {
    case SET_TRAVEL_MODE:
      return action.payload.travelMode;
    default:
      return state;
  }
};

export default combineReducers({
  travelMode: handleTravelMode,
  walkshed: handleWalkshed,
  walktime: handleWalktime,
});
