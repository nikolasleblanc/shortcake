var express = require('express');
var router = express.Router();
var randtoken = require('rand-token');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

router.get('/links', function(req, res) {
    var db = req.db;
    var collection = db.get('links');
    collection.find({},{},function(e,docs){
	res.render('links', { 
		title: 'Links',
		links : docs
	});
    });
});

router.get('/links/:shortLink', function(req, res) {
    var db = req.db;
    var collection = db.get('links');
    collection.findOne({"short":req.params.shortLink},{},function(e,docs){
        if (e)
        	res.send(e)
        res.location(docs.long);
        res.redirect(docs.long);
    });
});

router.get('/add', function(req, res) {
    res.render('add', { title: 'Add Link' });
});

router.post('/addLink', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var shortLink = randtoken.generate(5);
    var longLink = req.body.longLink;

    // Set our collection
    var collection = db.get('links');

    // Submit to the DB
    collection.insert({
        "short" : shortLink,
        "long" : longLink
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("links");
            // And forward to success page
            res.redirect("links");
        }
    });
});

router.get('/:shortLink', function(req, res) {
	var db = req.db;
    var collection = db.get('links');
    collection.findOne({"short":req.params.shortLink},{},function(e,docs){
        if (e)
                res.send(e)
        res.location(docs.long);
        res.redirect(docs.long);
    });

});

module.exports = router;
