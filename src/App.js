import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
} from 'reactstrap';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import AppNavbar from './components/AppNavbar';
import AppActionBar from './components/AppActionBar';
import MainView from './views/MainView';
import NewDownloadView from './views/NewDownloadView';
import DownloadDefaultOptionsView from './views/DownloadDefaultOptionsView';
import {
  fetchDownloads,
  fetchAppSettings,
  resetNewDownloadViewState
} from './actions';

class App extends Component {

  componentDidMount() {
    document.title = "downdatube!";
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED:", this.props.location.pathname);
    //this.props.resetNewDownloadViewState();
    //this.props.fetchAppSettings();
    switch (this.props.location.pathname) {
      case '/all':
        this.props.fetchDownloads('all');
        break;
      case '/downloading':
        this.props.fetchDownloads('downloading');
        break;
      case '/finished':
        this.props.fetchDownloads('finished');
        break;
      case '/new':
        break;
      case '/dl_options':
        break;
      default:
        break;
    }
  }

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
              <Route exact path="/dl_options" component={DownloadDefaultOptionsView} />
              <Redirect from="/" to="/downloading"/>
            </Switch>
        </Container>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      fetchDownloads,
      fetchAppSettings,
      resetNewDownloadViewState
    }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(App));
