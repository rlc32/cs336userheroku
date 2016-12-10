import React from 'react';
import $ from 'jquery';
import Remarkable from 'remarkable';

import Comment from './comment';

module.exports = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment id={comment.id} name={comment.name} key={comment.id}>
          {comment.city}{' '}{comment.state}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});