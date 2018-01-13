import React from 'react';
import { Alert, Button, Container, Col, Label, Input, Row, UncontrolledAlert } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createNewDownload, forceRedownload, fetchDownloads } from '../actions';

class QuickDownloadWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {url: ""};

    this.addDownload = this.addDownload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("downloadWidget.componentWillReceiveProps:", nextProps);
    if (nextProps.status != 'INITIAL') {
      this.props.fetchDownloads(nextProps.refreshType);
    }
  }

  forceDownload(videoId) {
    console.log("Force download", videoId);
    this.props.forceRedownload(videoId);
    this.setState({url: ""});
  }

  addDownload() {
    if (this.state.url == "") {
      return;
    }
    this.props.createNewDownload(this.state.url);
    this.setState({url: ""});
  }

  updateUrl(evt) {
    this.setState({
      url: evt.target.value
    });
  }

  /* TODO refactor into separate component so that you DRY!*/
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

  renderAlerts() {
    switch (this.props.newDownload.status) {
      case 'SUCCESS':
      return (
        <Row>
          <Col>
            <UncontrolledAlert color="success">
            {'Video queued with id=' + this.props.newDownload.videoId + '.'}
            </UncontrolledAlert>
          </Col>
        </Row>
      )
      case 'ERROR':
      return (
        <Row>
          <Col>
            <UncontrolledAlert color="warning">
            {this.renderErrorAlertContents()}
            </UncontrolledAlert>
          </Col>
        </Row>
      )
    }

  }

  render() {
    return (
      <div style={{marginBottom: "10px"}}>
        <Container fluid>
          {
            this.props.newDownload.status != 'INITIAL' && this.renderAlerts()
          }
          <Row>
            <Col xl="8">
              <Input name="url" id="videoUrl" placeholder="Paste video URL from Youtube here!" value={this.state.url} onChange={evt => this.updateUrl(evt)}/>
            </Col>
            <Col>
              <Button outline onClick={this.addDownload} color="primary">Add</Button>
            </Col>
          </Row>
        </Container>
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
      forceRedownload,
      fetchDownloads
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickDownloadWidget);
