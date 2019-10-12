import React from 'react'
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";



class Cards extends React.Component{

    toPrettyTimeString = time => {
        const theDate = new Date(time);
        const timeString = theDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let finalString = timeString;
        if (timeString.charAt(0) === '0'){
            finalString = timeString.slice(1);
        }
        return finalString
    }

    toPrettyLocationString = location => {
        return location.charAt(0).toUpperCase() + location.slice(1)
    }

    requestCards = () => {
        // this.setState({
        //     cards: []
        // });
        var request = new Request('https://swipeshareapi.herokuapp.com/', {method:'GET'});
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
            },
            selectedID: '',
            showConfirmation: false,
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
        const {userVerified, userEmail, showLoginM} = this.props;
        const {location, time, id} = theCardInfo;
        console.log('location', location)
        return(
            <Card key={id} style={{marginBottom:10}}>
                <CardContent>
                    <Typography variant='h5' align='left' style={{marginLeft:'5%'}}>
                        {this.toPrettyLocationString(location)} - {this.toPrettyTimeString(time)}
                    </Typography>
                </CardContent>
                <div>
                    <CardActions align='right' style={{justifyContent: 'flex-end'}}>
                        <Button size="medium" onClick={() => {
                            if (userVerified && userEmail !== ''){
                                console.log('good')
                                this.setState({
                                    selectedID: id.toString(),
                                    showConfirmation: true
                                })
                            } else {
                                showLoginM()
                            }
                        }}>Request Meal</Button>
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
        setInterval(this.requestCards, 10000)
    }

    render() {
        const {cards, showConfirmation, selectedID, selectedLocation, selectedTime} = this.state;
        const {userEmail} = this.props

        return(
            <div style={{marginLeft:'15%', marginRight: '15%'}}>
                <div style={{fontSize:30, textAlign:'left', marginBottom:10}}>Available Meal Swipes:</div>
                {this.showOptions()}
                <br/>
                {cards.length === 0 ? this.makeUnavailableCard() : this.cards()}
                <Dialog
                    open={showConfirmation}
                    onClose={() => this.setState({showConfirmation: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Please confirm your request</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You're agreeing to a meal at {selectedLocation ? this.toPrettyLocationString(selectedLocation) : null } at {this.toPrettyTimeString(selectedTime)}
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description2">
                            You will receive an email alert as a reminder.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({showConfirmation: false})} color="primary">
                            Back
                        </Button>
                        <Button onClick={() => {
                            const body = {
                                id: selectedID,
                                receiver_email: userEmail
                            };
                            fetch('https://swipeshareapi.herokuapp.com/makerequest',
                                {method:'POST',
                                    body:JSON.stringify(body),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }})
                                .then(response => response.status)
                                .then(status => {
                                    if (status !== 200){
                                        console.log('big bad')
                                    } else {
                                        console.log('success')
                                    }
                                }).catch(x => {
                                console.log('no data', x)
                                return('no data')
                            })
                            this.setState({showConfirmation: false})
                        }} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default Cards;