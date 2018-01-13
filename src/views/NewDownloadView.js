import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FaBeer from 'react-icons/lib/fa/beer';

import { createNewDownload, forceRedownload } from '../actions';

class NewDownloadView extends Component {

  constructor(props) {
    super(props);
    this.state = {goBack: false, url: ""};

    this.back = this.back.bind(this);
    this.saveAndAddAnother = this.saveAndAddAnother.bind(this);
    this.forceDownload = this.forceDownload.bind(this);
  }

  componentDidMount() {
  }

  saveAndAddAnother() {
    if (this.state.url == "") {
      return;
    }
    this.props.createNewDownload(this.state.url);
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

  renderErrorAlertContents() {
    if (!this.props.newDownload || !this.props.newDownload.error) return '';
    let error = this.props.newDownload.error;
    switch(error.error) {
      case 'VIDEO_URL_MALFORMED':
      return error.errorMsg;
      case 'VIDEO_ID_EXISTS':
      return (
        <div>
          {error.errorMsg + '   '}
          <Button outline color="primary" onClick={() => this.forceDownload(this.props.newDownload.error.videoId)}>Download Anyway</Button>
        </div>
      )
      default:
      return error.errorMsg;
    }
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
          <Alert color="primary" isOpen={this.props.newDownload.status == "INITIAL"}>
            Copy a video URL from Youtube to start download! <FaBeer />
          </Alert>
          <Alert color="success" isOpen={this.props.newDownload.status == "SUCCESS"}>
            {'Video queued with id=' + this.props.newDownload.videoId + '.'}
          </Alert>
          <Alert color="warning" isOpen={this.props.newDownload.status == "ERROR"}>
            {this.renderErrorAlertContents()}
          </Alert>
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
