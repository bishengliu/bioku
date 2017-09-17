export const AppSetting = {
    'VERSION': '0.0.1',
    'NAME':'BioKu',

    //APP CONSTANTS
    'CONTAINER_FULLNESS_OVERVIEW_TOWER_PER_TABLE': 8,
    'BOX_VERTICAL': 8,
    'BOX_HORIZONTAL': 8,
    'BOX_EXTRA_LAYOYT': 8,
    
    //show user defined box label?
    'SHOW_BOX_LABEL': true,
    //'APP_COLORS': ['#EF9A9A','#F48FB1','#CE93D8','#B39DDB','#9FA8DA','#90CAF9','#81D4FA','#80DEEA','#80CBC4','#A5D6A7','#C5E1A5','#E6EE9C','#FFF59D','#FFE082','#FFCC80','#FFAB91','#BCAAA4','#EEEEEE','#000000','#FFFFFF'],
    'APP_COLORS': ['#F44336', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3','#03A9F4', '#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722','#795548','#9E9E9E','#607D8B','#000000', '#FFFFFF'],
    'BOX_POSITION_LETTERS':['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    'SAMPLE_TYPE':['GENERAL', 'CELL', 'CONSTRUCT', 'OLIGO', 'gRNA_OLIGO', 'TISSUE', 'VIRUS'], //DO NOT CHANGE THIS *****
    //sample search keywords
    SAMPLE_KEYWORDS: [
        //GENERAL
        'Sample Type','Sample Name','Official Name','Sample Tag','Sample Code','Reference Code',
        'Freezing Code','Occupied','Researcher','Attachment','Comments',
        //CONSTRUCT
        'Feature','Backbone','Insert','Marker',
        //CELL
        //'project','creator',
        //OLIGO
        'Oligo Name',
        //VIRUS
        'Plasmid','Titration Celltype','Titration Code',
        //PATHOLOGY
        'Pathology Code','Tissue'
    ],
    SAMPLE_PARSEDKEYWORDS: [
        //GENERAL
        'type','name','official_name','tag','registration_code','reference_code',
        'freezing_code','occupied','researchers','attachments','description',
        //CONSTRUCT
        'feature','backbone','insert','marker',
        //CELL
        //'project','creator',
        //OLIGO
        'oligo_name',
        //VIRUS
        'plasmid','titration_cell_type','titration_code',
        //PATHOLOGY
        'pathology_code','tissues'
    ],
    //////////////////////////////////API URLS////////////////////////////
    //API REST URL
    'URL': 'http://127.0.0.1:8000',
    //post to get token
    'TOKEN_URL': '/api/users/token/',
    //get auth_user
    'AUTH_USER': '/api/users/auth_user/',
    //find username, user email and other info
    'FIND_USER_DETAILS':'/api/users/search/',
    //find group info
    'FIND_GROUP_DETAILS':'/api/groups/search/',
    //user register
    'REGISTER_USER': '/api/users/register/',
    //find my groups with researchers
    'AUTH_GROUPS':'/api/groups/mygroups/',
    //user change password
    'CHANGE_PASSWORD': '/api/users/password/',
    //UPDATE_USER_PROFILE
    'UPDATE_USER_PROFILE': '/api/users/',
    //GROUP API
    'SINGLE_GROUP_API': '/api/groups/',
    //UPDATE GROUP INFO
    'UPDATE_GROUP_INFO': '/api/groups/update/',
    //find all groups
    'ALL_GROUPS': '/api/groups/',
    //find all users
    'ALL_USERS':'/api/users/',
    //find all conatiners
    'ALL_CONTAINERS': '/api/containers/',
    //FIND CONTAINER 
    'FIND_CONTAINER_DETAILS': '/api/containers/search/',
}