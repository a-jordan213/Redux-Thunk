import React from "react";
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, ModalBody, Modal, ModalHeader, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from "react-redux-form";
import { Loading } from './LoadingComponent';

const required = val => val && val.length; //field if it has something in it false would be error
const maxLength = len => val => !val || (val.length <= len); //both false will create error
const minLength = len => val => val && (val.length >= len);

class CommentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
};


this.toggleModal = this.toggleModal.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);

}


toggleModal() {
  this.setState({
      isModalOpen: !this.state.isModalOpen
  });
}
handleSubmit(values) {
  this.toggleModal();
  this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
}

  render() {
    return (
      <div>
        <Button outline onClick={this.toggleModal}><i className="fa fa-pencil fa-lg" />Submit Comment</Button>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
               <ModalBody>
                 <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                 <Label htmlFor="rating">Rating</Label>
                 <Control.select defaultValue={1} model=".rating" id="rating" name="rating" className="form-control">
                   <option value="1">1</option>
                   <option value="2">2</option>
                   <option value="3">3</option>
                   <option value="4">4</option>
                   <option value="5">5</option>
                 </Control.select>
                   <Label htmlFor="author">Your Name</Label>
                 <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                          required, 
                                          minLength: minLength(2),
                                          maxLength: maxLength(15)
                                      }}
                                        />
                                         <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }} />
                        <Label htmlFor="text">Comment</Label>   
                 <Control.textarea model=".text" id="text" name="text"
                                        placeholder="Type your response..."
                                        className="form-control" rows="12"
                                        />
                                  <div className="form-group">     
                    <Button value="submit" color="primary" type="submit">Submit Comment</Button>
                    </div> 
                 </LocalForm>
               </ModalBody>
       </Modal>
      </div>

    );
  }
}



function RenderCampsite({campsite}) {
        return(
            <div className="col-md-5 m-1">
                <Card>
                    <CardImg top src={campsite.image} alt={campsite.name} />
                    <CardBody>
                       
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

function RenderComments({comments, addComment, campsiteId}) {
        if (comments) {
          return (
            <div className="col-md-5 m-1">
              <h4>Comments</h4>
              {comments.map((comment) => {
                return (
                  <div key={comment.id}>
                    <p>{comment.text}</p>
                    <p>{comment.author}{new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(Date.parse(comment.date)))}</p>
                    
                  </div>
                );
              })}
              <CommentForm campsiteId={campsiteId} addComment={addComment} />
            </div>
          );
        }
      }

      function CampsiteInfo(props) {
        if (props.isLoading) {
          return (
              <div className="container">
                  <div className="row">
                      <Loading />
                  </div>
              </div>
          );
      }
      if (props.errMess) {
          return (
              <div className="container">
                  <div className="row">
                      <div className="col">
                          <h4>{props.errMess}</h4>
                      </div>
                  </div>
              </div>
          );
      }
        if (props.campsite) {
            return (
              <div className="container">
              <div className="row">
                  <div className="col">
                      <Breadcrumb>
                          <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                          <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                      </Breadcrumb>
                      <h2>{props.campsite.name}</h2>
                      <hr />
                  </div>
              </div>
              <div className="row">
                  <RenderCampsite campsite={props.campsite} />
                  <RenderComments 
                      comments={props.comments}
                      addComment={props.addComment}
                      campsiteId={props.campsite.id} 
                      />
              </div>
          </div>
            );
        }
        return <div />;
    }
    
export default CampsiteInfo;