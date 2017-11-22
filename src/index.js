import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import store from 'store';
import init from 'init';

import AppWrapper from 'components/app-wrapper';
import HexBackground from 'components/hex-background';
import Home from 'components/home';
import Configure from 'components/configure';
import Changelog from 'components/changelog';
import Sector from 'components/sector';
import EntityInfo from 'components/entity-info';
import SystemInfo from 'components/system-info';
import PlanetInfo from 'components/planet-info';

import 'styles/global.css';
import 'react-hint/css/index.css';

init(store);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppWrapper}>
        <Route component={HexBackground}>
          <IndexRoute component={Home} />
          <Route path="/configure" component={Configure} />
          <Route path="/changelog" component={Changelog} />
        </Route>
        <Route path="/sector/:sector" component={Sector}>
          <IndexRoute component={EntityInfo} />
          <Route path="system/:system" component={SystemInfo} />
          <Route path="planet/:planet" component={PlanetInfo} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
