# AccessMap Walksheds

## Installation

### Full deployment

This repo has a `docker-compose`-based deployment example.

#### 1. Install `docker` and `docker-compose`

The only tools you need for a full deployment are `docker` and `docker-compose`. It is
recommended that you allow your user to run `docker` by adding it to the `docker`
group.

#### 2. Acquire data

Get the `transportation.geojson` file representing the Seattle area. If you don't have
direct access to this file, you can build one yourself using the `accessmap-data` repo.

Place `transportation.geojson` in deploy/data

#### 3. Build assets

`cd` into the `deploy` directory and run

    docker-compose -f docker-compose.build.yml up

and wait for all steps to complete

#### 4. Run

Run `docker-compose up` and visit `localhost:2015` in a browser. To run in daemon mode,
use `docker-compose up -d`.

### Web app alone (e.g. for development purposes)

`accessmap-walksheds` is a React-based web application. For an optimal development
experience, it is often preferable to run the web app locally, for example so that you
can benefit from a faster dev cycle and get features like HMR.

#### 2. Set up environment variables

The web app needs to be informed of where it can retrieve data by setting some
environment variables:

- `REACT_APP_MAPBOX_TOKEN`: A Mapbox API token.
- `REACT_APP_TILESERVER`: The root directory of an AccessMap tileserver.
- `REACT_APP_ROUTESERVER`: The root directory of an AccessMap routing server
(`unweaver`).

These environment variables can be exported directly into your environment or set in
a `.env` file in the `webapp` directory (an example is available at `.env.sample`).

##### Mapbox API Token

You can retrieve this by making an account at mapbox.com.

##### AccessMap tileserver

`accessmap-walksheds` displays pedestrian network information using custom-built
vector tiles and needs to be informed of their location. The easiest way to get access
to a reliable tileserver is to use the `docker-compose` deployment example above: the
tileserver will be available at `http://localhost:2015/tiles`, so you can set the
environment variable:

    REACT_APP_TILESERVER=http://localhost:2015/tiles

##### AccessMap routeserver

`accessmap-walksheds` shows interactive walkshed information about the pedestrian
network under different pedestrian profiles. In order to do so, we need to get
walkshed data based on that network. In this implementation, that walkshed data is
created by the `unweaver` Python package, a flexible routing server.

The easiest way to get access to an `unweaver` routing server configured to work with
`accessmap-walksheds` is to use the `docker-compose` deployment described in the first
section, where the route server's root is `http://localhost:2015/api/routing`, so you
can set the environment variable:

    REACT_APP_ROUTESERVER=http://localhost:2015/api/routing

#### Install node dependencies

Run `npm ci` to get the exact dependencies used during development, as determined by
the `package-lock.json` file.

Note: your system might need to have `SQLite` development headers installed, as
web mapping packages sometimes need them to compile.

#### Run the web app

##### In dev mode

Run `npm run start`. The server will be running at `localhost:3000`.

##### In production mode

Run `npm run build`. This will create static assets in the `build` directory. To use
them, you need to run a web server that points at that directory. The simplest way is
to use Python:

    python3 -m http.server

This will create a server at port 8000, so your website is available at
`http://localhost:8000`.

You could also use `node` to do this, but you'll have to install a package:

    npm install -g node-static
    static -p 8000
