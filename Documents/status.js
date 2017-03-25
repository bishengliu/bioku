//this is the explanation of the models for the project
//this project will use redux to manage the status of data

var roles = 
[
    { "id": 1, "role": "Admin"},  //full access
    { "id": 2, "role": "PI" }, //group access    
    { "id": 3, "role": "Researcher" }, //researher
    { "id": 4, "role": "student" } //readonly access
];

var admins = [
    "b.liu@nki.nl",
    "bishengliu36@gmail.com"
];

//all groups
var groups = 
[
    {
        "id": 1,
        "PI" :'BL',
        "PIName" :'Bisheng Liu',
        "avatar": "", //image, optional
        "email": "b.liu@nki.nl", //pi email
        "assistantEmails": [], //who can represent the pi
        "telephone": null, //optional
        "groupName" :'Admin',//group name like jos jonkers' lab
        "depart" :'Admin', //optional
        "researchers": ["b.liu@nki.nl", "bishengliu36@gmail.com"] //all the researhers in the group
    },
    {
        "id": 2,
        "PI" :'JJ',
        "PIName" :'Jos Jonkers',
        "avatar": "", //image, optional
        "email": "j.jonkers@nki.nl", //pi email
        "assistantEmails": [], //who can represent the pi
        "telephone": null, //optional
        "groupName" :'Molecular Oncology',//group name like jos jonkers' lab
        "depart" :'Molecular Oncology', //optional
        "researchers": [] //all the researhers in the group
    }
]

//current user
//researher
var currentUser = 
{
    "id": 1,
    "name" :'b.liu',
    "firstName": "Bisheng",
    "lastName": "Liu",
    "avatar": "", //image //optional
    "email" : 'b.liu@nki.nl',
    "telephone": null, //optional
    "role": ["Admin"], //role to manage/view samples
    "isLogin": false,
    "groupId": [1,2]
}


//all containers in the current group
var containers = 
[
    {
        //container1
        //tower, shelf, box
        "id": 1,
        "name": "container1",
        "room": "Room1",
        "groupId": [],
        "temprature": "-80",
        "tower": 24, //total number of towers
        "shelf": 8, //total number of shelve per tower
        "box": 5, //total number of boxes per shelf
        "boxVertial": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "boxHorizontal": ["1", "2", "3", "4", "5", "6", "7", "8"]
    },
    {
        //container2
        "id": 2,
        "name": "container2",
        "room": "Room2",
        "groupId": [],
        "temprature": "-180",
        "tower": 24, //total number of towers
        "shelf": 8, //total number of shelve per tower
        "box": 5, //total number of boxes per shelf
        "boxVertial": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "boxHorizontal": ["1", "2", "3", "4", "5", "6", "7", "8"]
    }
]
//one box
var box =
{
    "id": 0,
    "tower": 0, //tower 1
    "shelf": 0, //shelf 1
    "box": 0, //box 1
    "samples":[
        //only display the locations that have samples
        {
            "id": 0, //position in the box
            "pos": "A1", //position in the box
            "isOccupied": true,
            "dateIn": null, //the timestamp when pos was occupied
            "sampleInfo": //sample info
            {

            }        
        }, 
    ],
    "groupId": 1,
    "researhcers": [1]
}

//container and boxes


//need to think about switch containers for maintanance
//swtich tower, shelf, box and sample (cross boxes)
//a simple reminders