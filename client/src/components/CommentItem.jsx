import React from 'react';

class CommentItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { comment } = this.props;

    return (
      <div>
        {/* {comment.id} */}
        Comment
      </div>
    )
  }
}

export default CommentItem;
