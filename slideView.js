import React from 'react'
import {View, ScrollView, Image, TouchableHighlight, Text, Dimensions } from 'react-native'

const C_MARGIN = 20
export default class SlideView extends React.Component {
    
    constructor(props){
        super(props)
        this.width = Dimensions.get('window').width * 0.6
        this.objWidth = this.width + (C_MARGIN * 2)
        // this.width = Dimensions.get('window').width * 0.7
        this.scrolling = false
        this.state = {activePage: 1}
        this.animationFactor = [0, 0, 0]
    }

    onLayout = (e) => {
        // this.width = e.nativeEvent.layout.width
        this.height = e.nativeEvent.layout.height
        this.x = e.nativeEvent.layout.x
        this.y = e.nativeEvent.layout.y

        // alert(`h ${this.height} w ${this.width}  x${this.x} y ${this.y}`)
      }

      onScroll(e) {
        this.x = e.nativeEvent.contentOffset.x
        // console.log('X', e.nativeEvent.contentOffset.x, e.nativeEvent)
        const currPagePosition = this.x / this.objWidth
        const position = (currPagePosition % 1)
        const page = Math.abs(currPagePosition - position)
        let actualPage = page
        if (position > 0.5){
            actualPage++
        }

        this.animationFactor[0] = 0
        this.animationFactor[1] = 0
        this.animationFactor[2] = 0

        this.animationFactor[page] = 1 - position
        // console.log('animation', this.animationFactor, 'position', position, 'currentPagePosition', currPagePosition)
        if (this.animationFactor && (page < this.animationFactor.length)) this.animationFactor[page + 1] = position
        // this.setState({activePage: actualPage + 1})
        this.forceUpdate()
      }

    onScrollEnd(e, isMomentum) {
        
        // this.x = e.nativeEvent.contentOffset.x
        const currPagePosition = this.x / this.objWidth
        const position = (currPagePosition % 1)
        const page = Math.abs(currPagePosition - position)
        let actualPage = page
       
        if (position > 0.5){
            actualPage++
        }
        if (!isMomentum){
            setTimeout(function() {
                if (!this.scrolling){
                    this.scrolling = false
                    this.refs.ScrollViewObj.scrollTo({x: actualPage * this.objWidth, y: 0, animated: true})
                    // console.log('onScrollEnd', e, this)
                    this.setState({activePage: actualPage + 1})
                }
            }.bind(this), 50);
        }
        else{
            // console.log('onScrollEndMomentum', e, this)
            this.scrolling = false
            this.refs.ScrollViewObj.scrollTo({x: actualPage * this.objWidth, y: 0, animated: true})
            this.setState({activePage: actualPage + 1})
        }
    }

    onMomentumScrollBegin () {
        this.scrolling = true
    }
        
    render() {
        const { activePage } = this.state
        // console.log(this.animationFactor, 200 + (100 * this.animationFactor[0]), 200 + (100 * this.animationFactor[1]), 200 + (100 * this.animationFactor[2])) 

        return (
            <View onLayout={this.onLayout} style={this.props.style} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.7}}>
                <ScrollView style={{flex: 1}} horizontal={true} contentContainerStyle={{padding: 50}}
                    ref='ScrollViewObj'
                    showsHorizontalScrollIndicator={false}
                    onTouchEnd={(e) => {this.onScrollEnd(e, false)}}
                    onMomentumScrollBegin={() => {this.onMomentumScrollBegin()}}
                    onMomentumScrollEnd={(e) => {this.onScrollEnd(e, true)}}
                    onScroll={(e) => {this.onScroll(e)}} 
                    >
                    <Image
                        style={{ height: 200 + (50 * this.animationFactor[0]), width: this.width, marginLeft: C_MARGIN, marginRight: C_MARGIN}}
                        source={require("./images/1.png")}
                    />

                    <Image
                        style={{ height: 200  + (50 * this.animationFactor[1]), width: this.width, marginHorizontal: C_MARGIN }}
                        source={require("./images/1.png")}
                    />

                    <Image
                        style={{ height: 200 + (50 * this.animationFactor[2]), width: this.width, marginHorizontal: C_MARGIN }}
                        source={require("./images/1.png")}
                    />


                </ScrollView>
            </View>
        )
    }
}