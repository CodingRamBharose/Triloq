export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`; 
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;

export const GET_USER_INFO_ROUTE = `${AUTH_ROUTES}/user-info`;

export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;

export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;


export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-contact-for-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-all-contact`;


export const MESSAGES_ROUTES = "api/messages";
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNELS_ROUTES = "api/channels";
export const CREATE_CHANNEL_ROUTE = `${CHANNELS_ROUTES}/create`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNELS_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNELS_ROUTES}/get-channel-messages`;

