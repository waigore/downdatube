import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
} from 'reactstrap';
import {Switch, Route, Redirect} from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import AppActionBar from './components/AppActionBar';
import MainView from './views/MainView';
import NewDownloadView from './views/NewDownloadView';
import {fetchDownloads} from './actions';

class App extends Component {
  render() {
    return (
      <div style={{padding: '.5rem'}}>
        <AppNavbar />
        <AppActionBar />
        <Container fluid>
            <Switch>
              <Route exact path="/all" render={() =>
                <MainView viewType="all" />
              }/>
              <Route exact path="/downloading" render={() =>
                <MainView viewType="downloading" />
              }/>
              <Route exact path="/finished" render={() =>
                <MainView viewType="finished" />
              }/>
              <Route exact path="/new" component={NewDownloadView} />
              <Redirect from="/" to="/downloading"/>
            </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
