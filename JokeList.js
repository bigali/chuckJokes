import React, { Component } from "react";
import { FlatList, Text } from 'react-native'
import axios from "axios";
import {Button, Card, Title} from "react-native-paper";

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jokes: [],
            loading:  false
        }
    }
    componentDidMount() {
        let url = ""
        const  base_url = "http://api.icndb.com/jokes/"
        if(this.props.type  === "random") {
            url = base_url + "random/20"
        } else if(this.props.type  === "explicit") {
            url = base_url + "random/20?limitTo=[explicit]"
        } else if(this.props.type === "nerdy") {
            url = base_url + "random/20?limitTo=[nerdy]"
        }
        axios.get(url)
            .then( (response) => {
                // handle success
                this.setState({
                    jokes: response.data.value
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
    renderJoke = ({item}) => {
        return (
            <Card style={{margin: 4}}>
                <Card.Content>
                    <Title>{item.joke}</Title>
                </Card.Content>
                <Card.Actions>
                    <Button>share</Button>
                    <Button>save</Button>
                </Card.Actions>
            </Card>
        )
    }

    render() {
        console.log(this.state.jokes)
        return (
            <FlatList
                data={this.state.jokes}
                renderItem={this.renderJoke}
            />
        )
    }
}