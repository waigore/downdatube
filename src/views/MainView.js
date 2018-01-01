import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
} from 'reactstrap';
import {Switch, Route, Redirect} from 'react-router-dom';
import DownloadEntryTable from '../components/DownloadEntryTable';

class MainView extends Component {

  renderView() {
    switch (this.props.viewType) {
      case 'ALL':
      return (
        <div>
          <h3>All</h3>
          <DownloadEntryTable />
        </div>
      );
      case 'DOWNLOADING':
      return (
        <div>
          <h3>Downloading</h3>
          <DownloadEntryTable />
        </div>
      );
      case 'COMPLETED':
      return (
        <div>
          <h3>Completed</h3>
          <DownloadEntryTable />
        </div>
      );
      default:
      return (
        <div>
          <h3>All</h3>
          <DownloadEntryTable />
        </div>
      );
    }
  }

  render() {
    return this.renderView()
  }
}

export default MainView;
