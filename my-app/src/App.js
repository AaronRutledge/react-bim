import React from 'react';
import logo from './logo.svg';
import ForgeViewer from 'react-forge-viewer';
import './App.css';


class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      view:null
    }
  }

  handleViewerError(error){
    console.log('Error loading viewer.');
  }

  /* after the viewer loads a document, we need to select which viewable to
  display in our component */
  handleDocumentLoaded(doc, viewables){
    if (viewables.length === 0) {
      console.error('Document contains no viewables.');
    }
    else{
      //Select the first viewable in the list to use in our viewer component
      this.setState({view:viewables[0]});
    }
  }

  handleDocumentError(viewer, error){
    console.log('Error loading a document');
  }

  handleModelLoaded(viewer, model){
    console.log('Loaded model:', model);
  }

  handleModelError(viewer, error){
    console.log('Error loading the model.');
  }

  getForgeToken(){
    /* Normally, this would call an endpoint on your server to generate a public
    access token (using your client id and sercret). Doing so should yield a
    response that looks something like the following...
    */
    return {
      access_token:"token here",
      expires_in: "expiration here",
      token_type: "Bearer"
    };
  }

  /* Once the viewer has initialized, it will ask us for a forge token so it can
  access the specified document. */
  handleTokenRequested(onAccessToken){
    console.log('Token requested by the viewer.');
    if(onAccessToken){
      let token = this.getForgeToken();
      if(token)
        onAccessToken(
          token.access_token, token.expires_in);
    }
  }

  render() {
    return (
      <div className="App">
        <ForgeViewer
          version="6.0"
          urn="urn url"
          view={this.state.view}
          headless={false}
          onViewerError={this.handleViewerError.bind(this)}
          onTokenRequest={this.handleTokenRequested.bind(this)}
          onDocumentLoad={this.handleDocumentLoaded.bind(this)}
          onDocumentError={this.handleDocumentError.bind(this)}
          onModelLoad={this.handleModelLoaded.bind(this)}
          onModelError={this.handleModelError.bind(this)}
        />
      </div>
    );
  }
}

export default App;
