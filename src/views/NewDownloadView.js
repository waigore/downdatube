import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createNewDownload } from '../actions';

class NewDownloadView extends Component {

  constructor(props) {
    super(props);
    this.state = {goBack: false, url: ""};

    this.back = this.back.bind(this);
    this.saveAndAddAnother = this.saveAndAddAnother.bind(this);
  }

  componentDidMount() {
  }

  saveAndAddAnother() {
    this.props.createNewDownload(this.state.url);
    this.setState({url: ""});
  }

  back() {
    this.setState({url:"", goBack: true});
  }

  updateUrl(evt) {
    this.setState({
      url: evt.target.value
    });
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
            Copy a video URL from Youtube to start download.
          </Alert>
          <Alert color="success" isOpen={this.props.newDownload.status == "SUCCESS"}>
            {'Video queued with id=' + this.props.newDownload.videoId + '.'}
          </Alert>
          <Alert color="warning" isOpen={this.props.newDownload.status == "ERROR"}>
            {this.props.newDownload.error || ' '}
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
      createNewDownload
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDownloadView);
