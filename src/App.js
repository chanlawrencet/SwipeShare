import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close"
import MySwipes from "./MySwipes";
import Cards from './Cards'
import cookie from 'react-cookies'
import jumbo from './jumbo.gif'
import github from './github.svg'
import githubWord from './githubword.svg'

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hello: 'world',
            userEmail: cookie.load('email') ?  cookie.load('email') : '',
            userVerified: cookie.load('verified') ? cookie.load('verified') : false,
            cards: [],
            showLogin: false,
            enteredEmail: '',
            enteredCode: '',
            showInvalidMessage: false,
            showSuccessMessage: false,
            showInvalidCode: false,
            showCodeField: true,
            enteredDiningHall: '',
            showHome: true,
            showInfoMessage: false,
        };
    }


    submitEmail = () => {
        const {enteredEmail} = this.state
        if (this.isValidEmail(enteredEmail)){
            this.setState({
                showSuccessMessage: true
            })
        } else {
            this.setState({
                showInvalidMessage: true
            });
            return false;
        }
        const body = {
            email: enteredEmail
        };
        fetch('https://swipeshareapi.herokuapp.com/sendcode',
            {method:'POST',
                body:JSON.stringify(body),
                headers: {
                'Content-Type': 'application/json'
            }})
            .then(response => response.status)
            .then(status => {
                if (status !== 200){
                    console.log('big bad')
                }
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })

        const success = true;
        if (success){
            this.setState({showCodeField:true, enteredCode: ''})
        }
    }


    submitCode = () => {
        const {enteredCode, enteredEmail} = this.state
        if (!this.isValidEmail(enteredEmail)){
            this.setState({
                showInvalidMessage: true
            });
            return false;
        }
        const body = {
            email: enteredEmail,
            code: enteredCode
        };
        fetch('https://swipeshareapi.herokuapp.com/login',
            {method:'POST',
                body:JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }})
            .then(response => response.status)
            .then(status => {
                if (status === 200){
                    this.setState({
                        userEmail: enteredEmail,
                        userVerified: true,
                        showLogin: false,
                        enteredEmail: '',
                        enteredCode: ''
                    });
                    cookie.save('email', enteredEmail, { path: '/' })
                    cookie.save('verified', true, { path: '/' })
                } else {
                    this.setState({
                        enteredCode: '',
                        showInvalidCode: true,
                    })
                }
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
        console.log(enteredCode)
    };

    isValidEmail = enteredEmail => {
        const length = enteredEmail.length;
        return enteredEmail.substring(length - 10, length) === '@tufts.edu'
    };

    loginWindow(){
        const {enteredEmail, enteredCode, showCodeField} = this.state
        console.log(window.innerWidth)
        const targetWidth = window.innerWidth < 500 ? 300 : 450;
        const dontHaveCodePad = window.innerWidth < 500 ? 170 : 320;
        const haveCodeAlreadyPad = window.innerWidth < 500 ? 150 : 300;
        return(
            <div>
                <TextField
                    required
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    style={{width: targetWidth}}
                    value={enteredEmail}
                    onChange={e => this.setState({enteredEmail: e.target.value, showInvalidMessage: false})}
                />
                <br/>
                {showCodeField ? (
                    <div>
                        <TextField
                            required
                            id="outlined-email-input"
                            label="Code"
                            name="code"
                            margin="normal"
                            variant="outlined"
                            style={{width: targetWidth}}
                            value={enteredCode}
                            onChange={e => this.setState({enteredCode: e.target.value})}
                        />

                        <div style={{marginBottom: 10, marginLeft:dontHaveCodePad,  cursor: 'pointer', textDecoration: 'underline'}} onClick={() => this.setState({showCodeField: false})}>Don't have a code?</div>
                    </div>
                ) : null}
                {showCodeField ?
                    <Button type='submit' variant='contained' onClick={this.submitCode}>submit</Button> :
                    <div>
                        <div style={{marginBottom: 10, marginLeft:haveCodeAlreadyPad,  cursor: 'pointer', textDecoration: 'underline'}} onClick={() => this.setState({showCodeField: true})}>Have a code already?</div>
                        <Button type='submit' variant='contained' onClick={this.submitEmail}>send code</Button>
                    </div>

                }

            </div>
        )
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     this.setState({
    //         userEmail: cookie.load('email') ?  cookie.load('email') : '',
    //         userVerified: cookie.load('verified') ? cookie.load('verified') : false,
    //     })
    // }

    handleCloseGiverForm = () => {
        this.setState({showGiverForm: false})
    };

    render(){
        const {showInfoMessage, userVerified, userEmail, showHome, showLogin, showInvalidCode, showInvalidMessage, showSuccessMessage} = this.state;
        console.log(userVerified, userEmail)
        return (
            <div className="App">
                <div>
                    <span style={{fontSize:75, marginTop:10, fontFamily: 'Darker Grotesque'}}>Swipe Share</span>
                    <img style={{marginLeft: 7, marginTop: 5, width:100}} src={jumbo}/>
                    <div style={{fontSize:20}}>An easy way to share your meal swipes!</div>
                </div>
                <br/>
                {userEmail && userVerified ? <div>
                    <span>Logged in as {userEmail}. </span>
                    <span style={{ cursor: 'pointer', textDecoration: 'underline'}} onClick={() => {
                        this.setState({userEmail: '', userVerified: false})
                        cookie.remove('email', { path: '/' })
                        cookie.remove('verified', { path: '/' })
                        window.location.reload();
                    }}>logout?</span>
                    <br/>
                    <br/>
                    <Button variant='contained' color={showHome ? 'primary' : 'secondary'} onClick={() => {
                        this.setState({showHome: !showHome})
                    }}>{!showHome ?' Go Home' : 'My Swipes'}</Button>
                </div> : <Button  variant='contained' onClick={() => this.setState({showLogin: !showLogin})}>login</Button>}

                {showLogin ? this.loginWindow() : null}
                <br/>
                <br/>
                {showHome?
                    <Cards userVerified={userVerified} userEmail={userEmail} showLoginM={() => this.setState({showLoginMessage: true})}/> :
                    <MySwipes userVerified={userVerified} userEmail={userEmail} showLoginM={() => this.setState({showLoginMessage: true})}/>
                }

                <Snackbar
                    variant="error"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={showInvalidMessage}
                    onClose={() => this.setState({showInvalidMessage: false})}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={2000}
                    message={<span id="message-id">Not a @tufts.edu address!</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.setState({showInvalidMessage: false})}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
                <Snackbar
                    variant="error"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={showSuccessMessage}
                    onClose={() => this.setState({showSuccessMessage: false})}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={2000}
                    message={<span id="message-id">Check your email for a code!</span>}

                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.setState({showSuccessMessage: false})}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
                <Snackbar
                    variant="error"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={showInvalidCode}
                    onClose={() => this.setState({showInvalidCode: false})}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={2000}
                    message={<span id="message-id">Invalid Code!</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.setState({showInvalidCode: false})}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
                <div style={{marginTop: 30}}>Made with <span role="img" aria-label='heart'>❤️</span>at Polyhack 2019</div>
                <br/>
                <a href={'https://github.com/chanlawrencet/swipeshare'}
                   onMouseEnter={() => this.setState({showInfoMessage: true})}
                   onMouseLeave={() => this.setState({showInfoMessage: false})}>
                    <img src={github} style={{marginRight:5}}/>
                    <img src={githubWord}/>
                </a>
                {showInfoMessage? <div style={{fontSize:10}}>Repo and info!</div>: <div/>}
            </div>
        );
    }
}
export default App;
