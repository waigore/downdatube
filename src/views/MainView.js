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
      case 'all':
      return (
        <div>
          <h3>All</h3>
          <DownloadEntryTable byStatus="all" />
        </div>
      );
      case 'downloading':
      return (
        <div>
          <h3>Downloading</h3>
          <DownloadEntryTable byStatus="downloading" />
        </div>
      );
      case 'finished':
      return (
        <div>
          <h3>Finished</h3>
          <DownloadEntryTable byStatus="finished" />
        </div>
      );
      default:
      return (
        <div>
          <h3>All</h3>
          <DownloadEntryTable byStatus="all" />
        </div>
      );
    }
  }

  render() {
    return this.renderView()
  }
}

export default MainView;
