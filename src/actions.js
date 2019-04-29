import travelModes from "./travel-modes";

const routeServer = process.env.REACT_APP_ROUTESERVER;

export const SET_TRAVEL_MODE = "SET_TRAVEL_MODE";
export const GET_REACHABLE = "GET_REACHABLE";
export const SET_WALKTIME = "SET_WALKTIME";
export const CLICK_MAP = "CLICK_MAP";

export const setTravelMode = (travelMode) => (dispatch, getState) => {
  dispatch({
    type: SET_TRAVEL_MODE,
    payload: { travelMode }
  });
  fetchWalkshed({}, dispatch, getState);
};

let walktimeTimeout;
export const setWalktime = walktime => (dispatch, getState) => {
  dispatch({
    type: SET_WALKTIME,
    payload: walktime,
  });

  clearTimeout(walktimeTimeout);
  walktimeTimeout = setTimeout(
    () => {
      fetchWalkshed({ walktime }, dispatch, getState);
    },
    50
  );
};

export const clickMap = (lon, lat) => (dispatch, getState) => {
  dispatch({
    type: CLICK_MAP,
    payload: { lon, lat }
  });
  fetchWalkshed({ lon, lat }, dispatch, getState);
};

export const getReachable = (lon, lat, reachable) => ({
  type: GET_REACHABLE,
  payload: {lon, lat, reachable},
});

export const fetchWalkshed  = (newParams, dispatch, getState) => {
  const state = getState();
  const { travelMode } = state;
  const queryParams = {
    lon: state.walkshed ? state.walkshed.lon : null,
    lat: state.walkshed ? state.walkshed.lat : null,
    max_cost: state.walktime,
    ...travelModes[travelMode],
    ...newParams,
  }

  // Check if all necessary params are set (namely, lon and lat)
  if (!queryParams.lon || !queryParams.lat) return;

  const esc = encodeURIComponent;
  const queryURL = Object.keys(queryParams)
    .map(k => `${esc(k)}=${esc(queryParams[k])}`)
    .join("&");

  const query = `${routeServer}/reachable/dynamic.json?${queryURL}`;

  fetch(query)
    .then((response) => {
      if (response.ok) {
        const json = response.json();
        return json;
      }
      throw new Error(response.status);
    })
    .then((json) => {
      dispatch(getReachable(queryParams.lon, queryParams.lat, json));
    })
    .catch(error => {});
}
