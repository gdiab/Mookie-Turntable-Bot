var houseboatbabies = [
    ['CAN YOU FEEL IT?', 86000], 
    ['YES I CAN FEEL IT!', 88500], 
    ['When I\'m at Jenny\'s house', 90000], 
    ['I look for bad ends', 93500], 
    ['Forget your parents!', 96000], 
    ['But it\'s just cat and mouse!', 98500]
];

var blastoff = [
    ['Well I won\'t call you!', 184000],
    ['If you don\'t call me!', 186000],
    ['No no I won\'t call you!', 188000],
    ['If you don\'t call me!', 190000], 
    ['Yeah!', 192000]
];

var sail = [
    ['SAIL', 34500]
];

var atomic garden = [
    ['And I\'m glad I\'m not Gorbachev', 69000],
    ['\'cause I\'d wiggle all night', 69500],
    ['Like jelly in a pot', 72000],
    ['Let\'s get in the pit!', 74500], 
    ['And a party that will never stop', 76500],
    ['Come out to plaaaaaaaaay!', 78900]
];
    
var new dark ages = [
    ['Can you hear the call!', 184000],
    ['We\'ll set this riiiiight!', 186000],
    ['I hope you\'re livin\' right!', 188000],
    ['At leats he\'s got a garden with a fertile plot', 190000], 
    ['These are the new dark ages!', 192000]
];

var songlist = [
    ['AWOLNATION', 'Sail', sail],
    ['Reptar', 'Blastoff', blastoff],  
    ['Reptar', 'Houseboat Babies', houseboatbabies]
];

exports.getLyrics = function (artist, song) {
    for (i in songlist) {
        if ((songlist[i][0] == artist) && (songlist[i][1] == song)) {
            return songlist[i][2];
        }
    }
    return null;
}