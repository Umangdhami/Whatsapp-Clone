
const URL = {
    // API 
    baseUrl : 'http://localhost:5011/'
}

const ENDPOINTS = {
    // API Endpoints
    login: URL.baseUrl + 'userLogin',
    register: URL.baseUrl + 'userRegister',
    getUser: URL.baseUrl + 'getChatUser',
    socketConnection: URL.baseUrl + 'user-namespace',
    getSingleUser : URL.baseUrl + 'getSingleUser',
    getLoginUser : URL.baseUrl + 'getLoginUser',
    saveChat : URL.baseUrl + 'save-chat',
    getChat : URL.baseUrl + 'get-chat',
    deleteChatUserside : URL.baseUrl + 'delete-chat-userside',
    deleteChatBothside : URL.baseUrl + 'delete-chat-bothside',
    updateChat : URL.baseUrl + 'update-chat',
    updateProfile : URL.baseUrl + 'updateProfile',
    loginUser : URL.baseUrl + 'loginUser'
}

export default ENDPOINTS