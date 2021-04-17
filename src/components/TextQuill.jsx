import ReactQuill, { Quill, Mixin, Toolbar } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { Sharer } from './Sharer';
import { userSession } from '../auth';
import { fetchTasks, saveTasks, getURL} from '../storage';
import { Flex, Box, Text } from '@blockstack/ui';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'

class TextQuill extends React.Component {
  constructor(props) {
    super(props)
    this.quillRef = null;      // Quill instance
    this.reactQuillRef = null; // ReactQuill component
    this.username = null;
    this.textInput = null;
    this.state = {
      tasks: [],
      loading: true,
      isPublic: false,
      username: '',
      notFound: false,
      fetchURL: '',
      input: ""
    };
  }
  

  setUsername(username)
  {
    this.username = username
  }

  componentDidMount() {
    this.attachQuillRefs()
    this.fetchText()
  }
  
  componentDidUpdate() {
    this.attachQuillRefs()
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  }
  
  insertText = ({ text }) => {
    var range = this.quillRef.getSelection();
    let position = range ? range.index : 0;
    this.quillRef.insertText(position, text)
  }



  saveText = () => {
    var range = this.quillRef.getSelection();
    let position = range ? range.index : 0;

    console.log(this.quillRef.getContents())
    saveTasks(userSession, this.quillRef.getContents(), this.state.isPublic)
    
  }
  
    

    fetchText = () => {
      const username = document.location.pathname.split('/')[2];
      console.log(userSession.loadUserData());
      const response = fetchTasks(userSession, username);
      var range = this.quillRef.getSelection();
      let position = range ? range.index : 0;
        if (response === null) {
          console.log("NOTHING FOUND")
        } else {
          console.log(response)
          response.then(vals => {
            this.quillRef.setContents(vals.tasks)
            console.log(vals.tasks);
          });
          this.setState({loading: false})
      }
    }

    fetchText = () => {
      const username = document.location.pathname.split('/')[2];
      console.log(userSession.loadUserData());
      const response = fetchTasks(userSession, username);
      var range = this.quillRef.getSelection();
      let position = range ? range.index : 0;
        if (response === null) {
          console.log("NOTHING FOUND")
        } else {
          console.log(response)
          response.then(vals => {
            this.quillRef.setContents(vals.tasks)
            console.log(vals.tasks);
          });
          this.setState({loading: false})
      }
    }

    fetchURL = () => {
      console.log(this.state.input)
      fetch(this.state.input)
        .then(response => response.json())
        .then((jsonData) => {
          console.log(jsonData)
          var range = this.quillRef.getSelection();
          this.quillRef.setContents(jsonData.tasks)
        })
        .catch((error) => {
        // handle your errors here
        console.error(error)
        })

    }

    getHeader = () => {
      if (this.state.loading) {
        return 'Loading...';
      }
      if (this.state.notFound) {
        return '404. No todos found here.';
      }
      if (this.state.username) {
        if (this.state.isPublic) {
          return `${this.state.username.split('.')[0]}'s todos`;
        }
        return `${this.state.username.split('.')[0]}'s todos are private`;
      }
    };

  render() {
    return (
      <div>
        <Box mb={4} width="100%">
            <Text textStyle="display.large" fontSize={7}>
              {this.getHeader()}
            </Text>
          </Box>
          {!this.state.loading && !this.setState.username && (
        <Sharer
              isPublic={this.state.isPublic}
              togglePublic={() => {
                this.setState({isPublic: !this.state.isPublic})
              }}
            />
            )}
            {this.state.loading ? <Text>loading...</Text> : this.state.todos}
        <ReactQuill
          ref={(el) => { this.reactQuillRef = el }}
          theme={'snow'} />

        <Button variant="primary" style = {{margin: "5px"}} onClick={this.fetchText}>Fetch</Button>
        <Button variant = "primary" style = {{margin: "5px"}} onClick={this.saveText}>Save Text</Button>
        <br></br>
        {/* <input onChange={event => { 
          this.fetchURL(event.target.value)
          this.setState({fetchURL: event.target.value})
        }} /> */}

          <Form style = {{margin: "5px"}}>
            <Form.Group controlId="formBasicEmail" >
              <Form.Label>URL of public documnet</Form.Label>
              <Form.Control ref={(el) => { this.textInput= el }} value={this.state.input} type="text" placeholder="Enter URL" onChange={event => { 
          this.setState({input: event.target.value});
          this.fetchURL()
          this.setState({fetchURL: event.target.value})
        }} />
            </Form.Group>
          </Form>

        <Button variant = "primary" style = {{margin: "5px"}} onClick={this.fetchURL}>Fetch from URL</Button>
      </div>
    )
  }
}

export default TextQuill;