import React from 'react';
import JokeList from "./JokeList"

export default class FavouriteFactScene extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            tri: props.tri
        }
    }



    render() {
        return(
            <JokeList tri={this.props.tri} type="facts" />
        )
    }

}