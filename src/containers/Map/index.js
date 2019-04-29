import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactMapboxGl from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import * as AppActions from "../../actions";

import MapSources from "../../components/MapSources";
// import LayerCostPoints from "./layers-costpoints";
import {
  OriginPathLayer,
  POILayer,
  SidewalksLayer,
  WalkshedLayer
} from "../../components/MapLayers";

const center = [-122.333592, 47.605628];
const zoom = [15];

const MapboxGL = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
  minZoom: 10,
  maxZoom: 20,
  bearing: [0],
  pitch: [0],
});

class Map extends Component {
  render() {
    const { poi, walkshed, walkshedOrigin } = this.props;

    return (
      <MapboxGL
        className="map"
        center={center}
        zoom={zoom}
        maxBounds={[[-122.714460, 47.406897], [-121.907342, 47.809213]]}
        style="mapbox://styles/mapbox/light-v9"  // eslint-disable-line react/style-prop-object
        onMouseMove={(m, e) => {
          m.getCanvas().style.cursor = "pointer";
        }}
        onDrag={m => {
          m.getCanvas().style.cursor = "grabbing";
        }}
        onClick={(m, e) => this.props.actions.clickMap(e.lngLat.lng, e.lngLat.lat)}
      >
        <MapSources />
        <SidewalksLayer />
        { (poi && walkshedOrigin) && <OriginPathLayer poi={poi} origin={walkshedOrigin} /> }
        { walkshed && <WalkshedLayer walkshed={walkshed} /> }
        { poi &&
            <POILayer
              poi={poi}
              fillColor={walkshedOrigin ? "#77f" : "#f77" }
              borderColor={walkshedOrigin ? "#00f" : "#f00" }
            />
        }
        { /*costPoints && <CostPointsLayer costPoints={costPoints} /> */}
      </MapboxGL>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    poi: state.walkshed ? [state.walkshed.lon, state.walkshed.lat] : null,
    walkshed: state.walkshed ? state.walkshed.reachable.edges : null,
    walkshedOrigin: state.walkshed ? state.walkshed.reachable.origin : null
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(AppActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
