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
        "id": 1, //pk
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
        "id": 2, //pk
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
    "id": 1, //pk
    "name" :'b.liu',
    "firstName": "Bisheng",
    "lastName": "Liu",
    "avatar": "", //image //optional
    "email" : 'b.liu@nki.nl',
    "telephone": null, //optional
    "role": ["Admin"], //role to manage/view samples
    "isLogin": false,
    "groupId": [1,2] //pk
}


//all containers in the current group
var containers = 
[
    {
        //container1
        //tower, shelf, box
        "id": 1, //pk
        "name": "container1",
        "room": "Room1",
        "avatar": "", //image //optional
        "code39": null, //for scanner barcode
        "QRCode": null, //QR code
        "groupId": [], //pk
        "temprature": "-80",
        "tower": 24, //total number of towers
        "shelf": 8, //total number of shelve per tower
        "box": 5, //total number of boxes per shelf
        "boxVertial": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "boxHorizontal": ["1", "2", "3", "4", "5", "6", "7", "8"]
    },
    {
        //container2
        "id": 2, //pk
        "name": "container2",
        "room": "Room2",
        "avatar": "", //image //optional
        "code39": null, //for scanner barcode
        "QRCode": null, //QR code
        "groupId": [], //pk
        "temprature": "-180",
        "tower": 24, //total number of towers
        "shelf": 8, //total number of shelve per tower
        "box": 5, //total number of boxes per shelf
        "boxVertial": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "boxHorizontal": ["1", "2", "3", "4", "5", "6", "7", "8"]
    }
]


//containers and boxes
var boxesInContainers =
[
    {
        "containerId":0, //pk
        "boxes": 
        [
            {
                "id": 0, //pk
                "postion": { "tower": 0, "shelf": 0, "box": 0 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            }, 
            {
                "id": 1,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 1 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            },
            {
                "id": 2,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 2 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            }, 
            {
                "id": 3,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 3 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            },
            {
                "id": 4,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 4 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            }
        ]
    },
    {
        "containerId": 1,//pk
        "boxes": 
        [
            {
                "id": 5,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 0 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            }, 
            {
                "id": 6,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 1 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            },
            {
                "id": 7,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 2 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            }, 
            {
                "id": 8,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 3 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            },
            {
                "id": 9,//pk
                "postion": { "tower": 0, "shelf": 0, "box": 4 },
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
            }
        ]
    }
];

//one box
var box =
{
    "id": 0, //pk
    "tower": 0, //tower 1
    "shelf": 0, //shelf 1
    "box": 0, //box 1
    "code39": null, //for scanner barcode
    "QRCode": null, //QR code
    "samples":
    [
        //only display the locations that have samples
        {
            "id": 0, //sample pk
            "pos": "A1", //position in the box
            "isOccupied": true,
            "dateIn": null, //the timestamp when pos was occupied
            "sampleInfo": //sample info
            {
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
                "name":"sampleName",
                "date": "2008-10-25", //date of freezing
                "regcode": "223460", //registration code to link with other systems, optional
                "pathoCode":"patho-17-234", //pathology code, optional
                "system": ["skin", "digest"],
                "tissue": [],
                "quantity": 10, //sample piece in the vial
                "type": "solid tumor", //sample type,
                "attachments": [], //urls
                "note": "some optional description",
                "freezeCode": "timestamp", //auto generate unique freezeCode to quick locate the sample freezing batch
                "researcher": [1, 2]
            }        
        }, 
        {
            "id": 2, //sample pk
            "pos": "A2", //position in the box
            "isOccupied": true,
            "dateIn": null, //the timestamp when pos was occupied
            "sampleInfo": //sample info
            {
                "code39": null, //for scanner barcode
                "QRCode": null, //QR code
                "name":"sampleName",
                "date": "2008-10-25", //date of freezing
                "barcode": "223460", //code to link with other systems, optional
                "pathoCode":"patho-17-234", //pathology code, optional
                "system": ["skin", "digest"],
                "tissue": [],
                "quantity": 10, //sample piece in the vial
                "type": "solid tumor", //sample type,
                "attachments": [], //urls
                "note": "some optional description",
                "freezeCode": "timestamp", //auto generate unique freezeCode to quick locate the sample freezing batch
                "researcher": [1, 2]
            }        
        }
    ],
    "groupId": 1,
    "researhcers": [1]
};

//need to think about switch containers for maintanance
//swtich tower, shelf, box and sample (cross boxes)
//a simple reminders