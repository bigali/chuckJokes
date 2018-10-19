import React, {Component} from "react";
import _ from 'underscore'
import he from 'he'
import {FlatList, Text, Share, AsyncStorage, StyleSheet, View, TouchableOpacity, Dimensions, Image} from 'react-native'
import axios from "axios";
import {Button, Card as MaterialCard, FAB, Title, IconButton, Colors, Portal, Modal} from "react-native-paper";
import CardStack, {Card} from 'react-native-card-stack-swiper';
import Carousel from "react-native-snap-carousel";
import ImageZoom from 'react-native-image-pan-zoom'
const SLIDER_1_FIRST_ITEM = 0;

const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ff9800', '#ff5722', '#795548', '#607d8b', '#9e9e9e']
var {height, width} = Dimensions.get('window');
export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jokes: [],
            favoriteJokes: props.favoriteJokes,
            loading: false,
            visible: false,
            currentImage: '',
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // only update chart if the data has changed

        if (this.props.tri !== prevProps.tri) {
            this.getJokes()
        }

        if(this.props.favoriteJokes) {
            if(this.props.favoriteJokes.length !== this.state.favoriteJokes) {
                this.setState({
                    favoriteJokes: this.props.favoriteJokes
                })
            }
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
            if (jokes) {
                const newJokes = jokes.concat(joke)
                this.storeItem("jokes", newJokes)
            } else {
                const newJokes = [joke]
                this.storeItem("jokes", newJokes)
            }


        }).catch((error) => {
        })
    }

    onDelete(joke) {
        console.log("joke",joke)
        console.log("jokes",this.state.jokes)
        let arr  = this.state.jokes
        arr = _.without(arr, _.findWhere(arr, {
            id: joke.id
        }));
        this.props.updateFavoriteJokes(arr)

        this.storeItem("jokes", arr)
    }
    async storeItem(key, item) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            let newJokes = this.state.jokes
            newJokes.push(item)
            this.props.updateFavoriteJokes(newJokes)

            return jsonOfItem;
        } catch (error) {
        }
    }

    async retrieveItem(key) {
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {

        }
        return
    }

    componentDidMount() {
        this.getJokes()
    }

    getJokes = () => {
        let url = ""
        const base_url = "https://www.chucknorrisfacts.fr/api/get?data="


        if (this.props.type === "favorite") {
            console.log("sdfqds")
        } else {
            if (this.props.type === "facts") {
                url = base_url + "type:text;nb:20;tri:" + this.props.tri
            } else if (this.props.type === "images") {
                url = base_url + "type:img;nb:20;tri:" + this.props.tri
            }

            axios.get(url)
                .then((response) => {
                    // handle success
                    this.setState({
                        jokes: response.data
                    })
                })
                .catch(function (error) {
                    // handle error
                })
                .then(function () {
                    // always executed
                });
        }

    }

    renderJoke = ({item, index}) => {
        const rand = colors[index % colors.length]
        let isText=true
        if(item.type) {
            if(item.type === "facts") {
                isText = true
            } else {
                isText = false
            }
        } else if(this.props.type) {
            if(this.props.type === "facts") {
                isText = true
            } else {
                isText = false
            }
        } else {
            return null
        }

        return (
            <MaterialCard style={{margin: 4}} key={item.id} onPress={isText ? () => {
            } : () => {
                this.setState({
                    currentImage: item.fact
                }, () => {
                    this._showModal()
                })
            }}>

                <MaterialCard.Content style={{
                    height: height * 0.6,
                    backgroundColor: isText ? rand : Colors.black,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {isText ?
                        <Title style={{color: 'white', textAlign: 'center'}}>{he.decode(item.fact)}</Title>
                        : <Image resizeMode={'contain'} style={{height: height * 0.6, width: width * 0.8}}
                                 source={{uri: item.fact}}/>
                    }
                </MaterialCard.Content>


            </MaterialCard>
        )
    }
    renderCardJoke = (joke) => {
        const rand = colors[Math.floor(Math.random() * colors.length)];
        return (
            <Card key={joke.id} style={[styles.card, {
                backgroundColor: rand
            }]}><Text style={styles.label}>{he.decode(joke.fact)}</Text></Card>

        )
    }
    _showModal = () => this.setState({visible: true});
    _hideModal = () => this.setState({visible: false});

    render() {
        const {visible} = this.state
        const currentJoke = this.state.jokes[this.state.slider1ActiveSlide]

        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40}}>
                <Carousel
                    ref={(c) => {
                        this._carousel = c;
                    }}
                    firstItem={SLIDER_1_FIRST_ITEM}

                    data={this.state.jokes}
                    renderItem={this.renderJoke}
                    sliderWidth={width}
                    itemWidth={width * 0.8}
                    onSnapToItem={(index) => this.setState({slider1ActiveSlide: index})}
                />
                <View style={styles.row}>
                    <FAB icon="share" style={styles.fab} onPress={() => this.onShare(he.decode(currentJoke.fact))}/>

                    {
                        this.props.type === "favorite" ?
                            <FAB icon="delete-forever" style={styles.fab} onPress={() => this.onDelete(currentJoke)}/>:
                            <FAB icon="favorite" style={styles.fab} onPress={() => this.onSave({...currentJoke, type: this.props.type})}/>
                    }

                </View>
                <Portal>
                    <Modal style={{backgroundColor: Colors.black}} visible={visible} onDismiss={this._hideModal}>
                        <View style={{
                            flex: 1,
                            backgroundColor: Colors.black,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ImageZoom
                                cropWidth={Dimensions.get('window').width}
                                cropHeight={Dimensions.get('window').height}
                                imageWidth={Dimensions.get('window').width}
                                imageHeight={Dimensions.get('window').width}
                                enableSwipeDown
                            >
                                <Image style={{width: width, flex: 1}} source={{uri: this.state.currentImage}}
                                       resizeMode={'contain'}/>
                            </ImageZoom>
                        </View>
                    </Modal>
                </Portal>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f2f2f2',
    },
    content: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 320,
        height: 470,
        backgroundColor: '#FE474C',
        borderRadius: 5,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
    },
    card1: {
        backgroundColor: '#FE474C',
    },
    card2: {
        backgroundColor: '#FEB12C',
    },
    label: {
        lineHeight: 400,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'System',
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        width: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
    row: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 8
    },

    fab: {
        margin: 8,
    },
});