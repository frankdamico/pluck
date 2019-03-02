import React from 'react';
import CommentItem from './CommentItem.jsx';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   comments: this.props.comments
    // }
  }
  render() {
    const { comments } = this.props;
    return (
      // {comments.map(comment => {
      //   <CommentItem comment={comment} />
      // })}
      <div>
        comments
      </div>
    );
  }
}
export default Comments;