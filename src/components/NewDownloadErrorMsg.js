import React from 'react';
import { Button, Container, Col, Label, Input, Row, UncontrolledAlert } from 'reactstrap';

class NewDownloadErrorMsg extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    let error = this.props.error;
    switch(error.error) {
      case 'VIDEO_URL_MALFORMED':
      return error.errorMsg;
      case 'VIDEO_ID_EXISTS':
      return (
        <div>
          {error.errorMsg + '   '}
          <Button outline color="primary" onClick={() => this.props.forceDownload(error.videoId)}>Download Anyway</Button>
        </div>
      )
      default:
      return error.errorMsg;
    }
  }
}

export default NewDownloadErrorMsg;
