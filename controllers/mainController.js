exports.index = (req, res) => {
    res.render('index.ejs'); 
};

exports.about = (req, res) => {
    res.render('./main/about.ejs');
};

exports.contact = (req, res) => {
    res.render('./main/contact.ejs');
};
