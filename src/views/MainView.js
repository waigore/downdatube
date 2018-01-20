import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
} from 'reactstrap';
import { Switch, Route, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FaRefresh from 'react-icons/lib/fa/refresh';
import DownloadEntryTable from '../components/DownloadEntryTable';
import QuickDownloadWidget from '../components/QuickDownloadWidget';

import {
  fetchDownloads,
  resetNewDownloadViewState
} from '../actions';

class MainView extends Component {

  constructor(props) {
    super(props);

    this.onRefreshClick = this.onRefreshClick.bind(this);
  }

  onRefreshClick() {
    console.log("Refresh clicked, fetching downloads!");
    this.props.fetchDownloads(this.props.viewType);
  }

  componentWillReceiveProps(nextProps) {
    console.log("mainView.componentWillReceiveProps:", nextProps);
    if (nextProps.newDownload.status != 'INITIAL') {
      console.log("Download entry table requests refresh!");
      this.props.fetchDownloads(this.props.viewType);

      setTimeout(() => {
        this.props.resetNewDownloadViewState();
      }, 3000);

    }
  }

  renderView() {
    switch (this.props.viewType) {
      case 'all':
      return (
        <div>
          <h3>All</h3>
          <QuickDownloadWidget refreshType="all" />
          <DownloadEntryTable byStatus="all" />
        </div>
      );
      case 'downloading':
      return (
        <div style={{verticalAlign: "middle"}}>
          <h3>Downloading  <span style={{fontSize: "16px"}}><FaRefresh onClick={this.onRefreshClick}/></span></h3>
          <QuickDownloadWidget refreshType="downloading" />
          <DownloadEntryTable byStatus="downloading" />
        </div>
      );
      case 'finished':
      return (
        <div>
          <h3>Finished</h3>
          <QuickDownloadWidget refreshType="finished" />
          <DownloadEntryTable byStatus="finished" />
        </div>
      );
      default:
      return (
        <div>
          <h3>All</h3>
          <QuickDownloadWidget refreshType="all" />
          <DownloadEntryTable byStatus="all" />
        </div>
      );
    }
  }

  render() {
    return this.renderView()
  }
}

function mapStateToProps(state) {
  return {
      newDownload: state.newDownload
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      fetchDownloads,
      resetNewDownloadViewState
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
