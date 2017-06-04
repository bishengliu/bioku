export const AppSetting = {
    'VERSION': '0.0.1',
    'NAME':'BioKu',
    'APP_COLORS': ['#F44336', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3','#03A9F4',
                   '#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722','#795548','#9E9E9E','#607D8B','#000000', '#FFFFFF'],
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
    'UPDATE_USER_PROFILE':'/api/users/',
    //GROUP API
    'SINGLE_GROUP_API': '/api/groups/',
    //UPDATE GROUP INFO
    'UPDATE_GROUP_INFO': '/api/groups/update/',
    //find all groups
    'ALL_GROUPS':'/api/groups/',
    //find all users
    'ALL_USERS':'/api/users/',

    //find all conatiners
    'ALL_CONTAINERS':'/api/containers/',
    //FIND CONTAINER 
    'FIND_CONTAINER_DETAILS': '/api/containers/search/',
}