import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

import Comics from './Comics';
import ComicDetail from './ComicDetail';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function Test() {
  let { slug } = useParams();
  return <div>Now showing test slug: {slug}</div>;
}

ReactDOM.render(
    <Router>
      <Switch>
        <Route exact path="/">
          <Comics />
        </Route>
        <Route path="/test/:slug">
          <Test />
        </Route>
        <Route path="/comic-detail/:comicId">
          <ComicDetail />
        </Route>
      </Switch>
    </Router>,
    document.getElementById('root'));
serviceWorker.unregister();
