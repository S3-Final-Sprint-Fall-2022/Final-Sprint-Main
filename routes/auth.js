const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const router = express.Router();

const { addLogin, getLoginByUsername } = require('../services/p.auth.dal')

router.use(express.static('public'));

// load the logEvents module
const logEvents = require('../services/logEvents');
// define/extend an EventEmitter class
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on('log', (event, level, msg) => logEvents(event, level, msg));

// LOGIN existing user
router.get('/', async (req, res) => {
    if(DEBUG) console.log('login page: ');
    myEmitter.emit('log', 'auth GET', 'INFO', 'Login page requested.');
    res.render('login', {status: req.app.locals.status});
});

router.post('/', async (req, res) => {
    try {
        if(DEBUG) console.log('auth.getLoginByUsername().try');
        let user = await getLoginByUsername(req.body.username);
        if(DEBUG) console.log(user);
        if(user === undefined) {
            myEmitter.emit('log', 'auth GET', 'WARNING', 'Incorrect user name was entered.');
            req.app.locals.status = 'Incorrect user name was entered.'
            res.redirect('/auth')
        }
        else if( await bcrypt.compare(req.body.password, user.password)) {
            // change using app.locals to use session or java web token (jwt)
            myEmitter.emit('log', 'auth GET', 'INFO', 'Happy for your return ' + user.username );
            req.app.locals.user = user;
            req.app.locals.status = 'Happy for your return ' + user.username;
            req.session.currentuser = user;
            res.redirect('/');
        } else {
            myEmitter.emit('log', 'auth GET', 'WARNING', 'Incorrect password was entered.');
            req.app.locals.status = 'Incorrect password was entered.'
            res.redirect('/auth')
        }
    } catch (error) {
        myEmitter.emit('log', 'auth/ POST', 'ERROR', error);
        console.log(error);
        if(DEBUG) console.log('auth.getLoginByUsername().catch: ' + user.username);
        res.render('503');
        // log this error to an error log file.
    }
});

// REGISTER new user
// from http browser it has /auth/new
router.get('/new', async (req, res) => {
    myEmitter.emit('log', 'auth/new GET', 'INFO', 'Registration page requested.');
    res.render('register', {status: req.app.locals.status});
});

router.post('/new', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        if (req.body.email && req.body.username && req.body.password ) {
            var result = await addLogin(req.body.username, req.body.email, hashedPassword);
            if(DEBUG) console.log('result: ' + result);
            // duplicate username, comes from uniqueness constraint 
            // in postgresql(err.code=23505) OR mongodb(err.code=11000)
            if(result === "23505" || result === 11000) {
                myEmitter.emit('log', 'auth/new POST', 'WARNING', 'Username already exists.');
                if(DEBUG) console.log('Username already exists, please try another.');
                req.app.locals.status = 'Username already exists, please try another.'
                res.redirect('/auth/new')
            } else {
                myEmitter.emit('log', 'auth/new POST', 'INFO', 'New account created with login_id: ' + result);
                req.app.locals.status = 'New account created, please login.'
                res.redirect('/auth');
            }
        } else {
            myEmitter.emit('log', 'auth/new POST', 'WARNING', 'Not enough form fields completed.');
            if(DEBUG) console.log('Not enough form fields completed.');
            req.app.locals.status = 'Not enough form fields completed.'
            res.redirect('/auth/new')
        }       
    } catch (error) {
        myEmitter.emit('log', 'auth/new POST', 'ERROR', error);
        console.log(error);
        res.render('503');
        // log this error to an error log file.
    }
});

router.get('/exit', async (req, res) => {
    if(DEBUG) console.log('get /exit');
    req.session.destroy(function(err) {
        req.app.locals.status = 'Successfully logged out of search.'
      })
    res.redirect('/');
});

module.exports = router