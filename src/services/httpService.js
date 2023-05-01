import appConfig from "../config.api";
import axios from "axios";


class HttpService {

  createGame = (user) => {
    return new Promise((resolve, reject) => {
      axios.post(appConfig.API_HOST + '/game/create', { user: user })
        .then((response) => resolve(response))
        .catch((error) => {
          reject(error.response)
        })
    });
  }

  signup = (username, email, password) => {
    return new Promise((resolve, reject) => {
      const user = {
        username: username,
        email: email,
        password: password
      }
      axios.post(appConfig.API_HOST + '/auth/signup', user)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data))
    });
  }

}

const HTPP_SERVICE = new HttpService();
export default HTPP_SERVICE;
