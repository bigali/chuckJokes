import React from 'react';
import JokeList from "./JokeList"

export default class FavouriteFactScene extends React.Component{
    render() {
        return(
            <JokeList tri={this.props.tri} type="favorite" />
        )
    }

}