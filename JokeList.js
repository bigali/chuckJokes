import React, { Component } from "react";
import { FlatList, Text, Share, AsyncStorage } from 'react-native'
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

    onShare(text) {
        Share.share({
            message: text,
            title: 'chuck joke'
        }, {
            // Android only:
            dialogTitle: 'chuck joke',
        })
    }

    onSave(joke) {
        this.retrieveItem("jokes").then((jokes) => {
            console.log("retrevied jokes", jokes)
            if(jokes) {
                const newJokes = jokes.concat(joke)
                this.storeItem("jokes", newJokes)
            } else {
                const newJokes = [joke]
                this.storeItem("jokes", newJokes)
            }

        }).catch((error) => {
            console.log("chuck noriss don't like errors")
        })
    }

    async storeItem(key, item) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    async retrieveItem(key) {
        try {
            const retrievedItem =  await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {
            console.log(error.message);
        }
        return
    }


    componentDidMount() {
        let url = ""
        const  base_url = "http://api.icndb.com/jokes/"


        if(this.props.type === "favorite") {
            this.retrieveItem("jokes").then((jokes) => {
                this.setState({
                    jokes: jokes
                })
            }).catch((error) => {
                console.log("error")
            })
        } else {
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

    }
    renderJoke = ({item}) => {
        return (
            <Card style={{margin: 4}}>
                <Card.Content>
                    <Title>{item.joke}</Title>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => this.onShare(item.joke)}>share</Button>
                    <Button onPress={() => this.onSave(item)}>save</Button>
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