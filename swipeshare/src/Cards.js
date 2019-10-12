import React from 'react'
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

class Cards extends React.Component{

    requestCards = () => {
        this.setState({
            cards: []
        });
        var request = new Request('https://swipeshare.herokuapp.com/', {method:'GET'});
        fetch(request)
            .then(response => response.json())
            .then(data => {
                this.setState({cards: data.entries})
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
    }

    constructor(props){
        super(props);
        this.state = {
            cards:[],
            filters: {
                carmichael: true,
                dewick: true,
                hodgdon: true
            }
        }

    }
    makeUnavailableCard(){
        return(
            <Card key='unavailable' style={{marginBottom:10}}>
                <CardContent>
                    <Typography variant='h6' align='center'>
                        No meals available at this time
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    makeUnavailableFiltersCard(){
        return(
            <Card key='unavailable' style={{marginBottom:10}}>
                <CardContent>
                    <Typography variant='h6' align='center'>
                        No meals available at this time for your selected filters.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    makeCard(theCardInfo){
        const {location, time} = theCardInfo;
        const theDate = new Date(time);
        const timeString = theDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let finalString = timeString;
        if (timeString.charAt(0) === '0'){
            finalString = timeString.slice(1);
        }
        return(
            <Card key={location+time+Math.random()} style={{marginBottom:10}}>
                <CardContent>
                    <Typography variant='h5' align='left' style={{marginLeft:'5%'}}>
                        {location.charAt(0).toUpperCase() + location.slice(1) } - {finalString}
                    </Typography>
                </CardContent>
                <div>
                    <CardActions align='right' style={{justifyContent: 'flex-end'}}>
                        <Button size="medium" >Request Meal</Button>
                    </CardActions>
                </div>

            </Card>

        )
    }

    makeFilters(){
        const {filters} = this.state;
        let toReturn = [];
        if (filters.carmichael){
            toReturn.push('carmichael')
        }
        if (filters.dewick){
            toReturn.push('dewick')
        }
        if (filters.hodgdon){
            toReturn.push('hodgdon')
        }

        return toReturn
    }
    cards(){
        const {cards} = this.state;
        let toReturn = [];
        const filtersList = this.makeFilters();
        cards.forEach(x => {
                if (filtersList.includes(x.location)){
                    toReturn.push(this.makeCard(x))}
            }
        );

        if (toReturn.length === 0){
            return this.makeUnavailableFiltersCard()

        }
        return toReturn
    }

    showOptions(){
        const {filters} = this.state;
        const {carmichael, dewick, hodgdon} = filters;
        return(
            <div>
                <Chip
                    className="chip"
                    key='carm'
                    label='Carmichael'
                    clickable
                    color={carmichael ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: !carmichael, dewick: dewick, hodgdon: hodgdon
                        }})}
                />
                <Chip
                    className="chip"
                    key='dew'
                    label='Dewick'
                    clickable
                    color={dewick ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: carmichael, dewick: !dewick, hodgdon: hodgdon
                        }})}
                />
                <Chip
                    className="chip"
                    key='hodge'
                    label='Hodgdon'
                    clickable
                    color={hodgdon ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: carmichael, dewick: dewick, hodgdon: !hodgdon
                        }})}
                />
            </div>
        )
    }

    componentDidMount() {
        this.requestCards()
        // setInterval(this.requestCards, 10000)
    }

    render() {
        const {cards} = this.state;
        return(
            <div style={{marginLeft:'15%', marginRight: '15%'}}>
                {this.showOptions()}
                {cards.length === 0 ? this.makeUnavailableCard() : this.cards()}
            </div>
        )
    }
}

export default Cards;