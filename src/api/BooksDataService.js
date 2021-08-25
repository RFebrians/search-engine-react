import axios from 'axios'
import {BOOKS_API_URL} from '../Constants'

class BooksDataService {
    
    searchWithTitle(title){
        return axios.get(`${BOOKS_API_URL}/title/${title}`)
    }

}

export default new BooksDataService()