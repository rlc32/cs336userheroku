import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

import { API_URL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {author: '', text: ''};
    },
    componentDidMount: function() {
        this.loadData();
    },
    componentDidUpdate: function(prevProps) {
        if (this.props.params.id != prevProps.params.id) {
            this.loadData();
        }
    },
    loadData: function() {
        $.ajax(API_URL + "/" + this.props.params.id) .done(function(comments) {
            this.setState(comments[0]);
        }.bind(this));
    },
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    handleUpdate: function() {
        var updatedComment = {
            author: this.state.author.trim(),
            text: this.state.text.trim()
        }
        $.ajax({
            url: API_URL + "/" + this.props.params.id,
            dataType: 'json',
            type: 'PUT',
            contentType:'application/json',
            data: JSON.stringify(updatedComment)
        })
         .done(function(comments){
             this.context.router.push('/');
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    },
    handleDelete: function() {
        $.ajax({
            url: API_URL + "/" + this.props.params.id,
            type: 'DELETE',
        })
         .done(function(comments){
             this.context.router.push('/');
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    },
    render: function() {
        return (
            <div>
                <form className="commentForm">
                    <h1>More about {this.state.name}</h1>
                    <p>{this.state.name} was killed on {this.state.date}. The victim was {this.state.manner_of_death} by police. The victim was armed with a {this.state.armed}.</p>
                    <p>The victim was {this.state.age}. The victim gender was {this.state.gender}. The victims ethnicity was {this.state.race}. This took place in {this.state.city} {this.state.state}. </p>
                    <p>Was there signs of mental illness: {this.state.signs_of_mental_illness}. What was the victim's threat level: {this.state.threat_level}. </p>
                    <p>Was the victim fleeing: {this.state.flee}. Did the Officer's responding have body cameras: {this.state.body_camera}.</p>
                </form>
                <Link to='/'>Back</Link>
            </div>
        );
    }
});