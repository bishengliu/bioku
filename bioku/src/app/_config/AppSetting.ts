export const AppSetting = {

    // CHECK THESE BEFORE PRODUCTION BUILD
    // API REST URL
     'URL': 'http://127.0.0.1:8000',
    // 'URL': 'http://127.0.0.1/biodataware',
    // APP URL FOR URL LINK TO THE FRONT-END
    'APP_URL': 'http://127.0.0.1:4200',
    // FOR SENDINFG RESET PASSWORD
    'APP_DEFAULT_EMAIL': 'b.liu@bioku.nl',

    // APP VERSION
    'VERSION': '0.0.1-alpha2',
    ///////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// DO NOT CHANGE BE IF NOT SURE ////////////////////////
    'NAME': 'BIOKU',
    // APP CONSTANTS
    'CONTAINER_FULLNESS_OVERVIEW_TOWER_PER_TABLE': 10,
    'BOX_VERTICAL': 8,
    'BOX_HORIZONTAL': 8,
    'BOX_EXTRA_LAYOYT': 8,
    // image size
    'CONTAINER_IMAGE_WIDTH': 640,
    'CONTAINER_IMAGE_HEIGHT': 640,
    // TOKEN EXPIRATION
    'TOKEN_EXPIRATION_HOUR': 6,
    // show user defined box label?
    'SHOW_BOX_LABEL': true,
    'APP_COLORS': ['#F44336', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000', '#FFFFFF'],
    'BOX_POSITION_LETTERS': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    'SAMPLE_TYPE': ['GENERAL', 'CELL', 'CONSTRUCT', 'OLIGO', 'gRNA_OLIGO', 'TISSUE', 'VIRUS'], // DO NOT CHANGE THIS *****
    // sample search keywords

    ////////////////////////////////// API URLS////////////////////////////
    // server reset password
    'RESET_PASSWORD': '/reset_password/',
    // confrim reset password
    'RESET_PASSWORD_CONFRIM': '/reset_password_confirm/',
    // post to get token
    'TOKEN_URL': '/api/users/token/',
    // get auth_user
    'AUTH_USER': '/api/users/auth_user/',
    // find username, user email and other info
    'FIND_USER_DETAILS': '/api/users/search/',
    // find group info
    'FIND_GROUP_DETAILS': '/api/groups/search/',
    // user register
    'REGISTER_USER': '/api/users/register/',
    // find my groups with researchers
    'AUTH_GROUPS': '/api/groups/mygroups/',
    // user change password
    'CHANGE_PASSWORD': '/api/users/password/',
    // UPDATE_USER_PROFILE
    'UPDATE_USER_PROFILE': '/api/users/',
    // GROUP API
    'SINGLE_GROUP_API': '/api/groups/',
    // UPDATE GROUP INFO
    'UPDATE_GROUP_INFO': '/api/groups/update/',
    // find all groups
    'ALL_GROUPS': '/api/groups/',
    // find all users
    'ALL_USERS': '/api/users/',
    // find all conatiners
    'ALL_CONTAINERS': '/api/containers/',
    // FIND CONTAINER
    'FIND_CONTAINER_DETAILS': '/api/containers/search/',
}
