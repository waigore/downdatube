import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FaBeer from 'react-icons/lib/fa/beer';

import NewDownloadErrorMsg from '../components/NewDownloadErrorMsg';
import { createNewDownload, forceRedownload } from '../actions';

class NewDownloadView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      goBack: false,
      url: "",
      initialAlertToggle: true,
      successAlertToggle: false,
      errorAlertToggle: false
    };

    this.dismissAllAlerts = this.dismissAllAlerts.bind(this);
    this.resetAlerts = this.resetAlerts.bind(this);
    this.back = this.back.bind(this);
    this.saveAndAddAnother = this.saveAndAddAnother.bind(this);
    this.forceDownload = this.forceDownload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      initialAlertToggle: nextProps.newDownload.status == 'INITIAL',
      successAlertToggle: nextProps.newDownload.status == 'SUCCESS',
      errorAlertToggle: nextProps.newDownload.status == 'ERROR'
    });

    setTimeout(() => {
      this.resetAlerts();
    }, 3000);
  }

  saveAndAddAnother() {
    if (this.state.url == "") {
      return;
    }

    let downloadOpts = {
      downloadAudio: false
    }
    this.props.createNewDownload(this.state.url, downloadOpts);
    this.setState({url: ""});
  }

  back() {
    this.setState({url:"", goBack: true});
  }

  forceDownload(videoId) {
    console.log("Force download", videoId);
    this.props.forceRedownload(videoId);
    this.setState({url: ""});
  }

  updateUrl(evt) {
    this.setState({
      url: evt.target.value
    });
  }

  resetAlerts() {
    this.setState({
      initialAlertToggle: true,
      successAlertToggle: false,
      errorAlertToggle: false
    });
  }

  dismissAllAlerts() {
    this.setState({
      initialAlertToggle: false,
      successAlertToggle: false,
      errorAlertToggle: false
    });
  }

  renderErrorAlertContents() {
    return (<NewDownloadErrorMsg error={this.props.newDownload.error} forceDownload={this.forceDownload} />);
  }

  render() {
    if (this.state.goBack) {
      return (
        <Redirect to="/downloading" />
      )
    }
    return (
      <div>
        <h3>New Video</h3>
        <div>
          {
            this.props.newDownload.status == 'INITIAL' &&
            <Alert color="primary" isOpen={this.state.initialAlertToggle} toggle={this.dismissAllAlerts}>
              Copy a video URL from Youtube to start download! <FaBeer />
            </Alert>
          }
          {
            this.props.newDownload.status == 'SUCCESS' &&
            <Alert color="success" isOpen={this.state.successAlertToggle} toggle={this.dismissAllAlerts}>
              {'Video queued with id=' + this.props.newDownload.videoId + '.'}
            </Alert>
          }
          {
            this.props.newDownload.status == 'ERROR' &&
            <Alert color="warning" isOpen={this.state.errorAlertToggle} toggle={this.dismissAllAlerts}>
              {this.renderErrorAlertContents()}
            </Alert>
          }
        </div>
        <Form>
          <FormGroup>
            <Label for="videoUrl">Url</Label>
            <Input name="url" id="videoUrl" placeholder="Video URL" value={this.state.url} onChange={evt => this.updateUrl(evt)}/>
          </FormGroup>
          <div>
            <Button onClick={this.back}>Back</Button>
            <Button onClick={this.saveAndAddAnother} color="primary">Save and add another</Button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        newDownload: state.newDownload
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      createNewDownload,
      forceRedownload
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDownloadView);
