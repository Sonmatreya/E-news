import decode_token from '../utils/index'

const storeReducer = (state, action) => {
    const { type, payload } = action

    if (type === 'login_success') {
        state.token = payload.token
        state.userInfo = decode_token(payload.token)
    }
    if (type === 'logout') {
        state.token = ''
        state.userInfo = ''
    }
    if (type === 'update_profile_image') {
        state.userInfo.image = payload.image
    }
    return state
}

export default storeReducer