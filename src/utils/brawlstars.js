require('dotenv').config()
const { BRAWLAPIKEY } = process.env

class BrawlStars {
    static endpoint = 'https://api.brawlstars.com/v1/'
    static headers = {
        Authorization: `Bearer ${BRAWLAPIKEY}`,
        Accept: 'application/json'
    }
    static Call(method, endpoint) {
        return fetch(`${this.endpoint}${endpoint}`, {
            method,
            headers: this.headers
        }).then(res => res.json())
    }
    static getUser(tag) {
        return this.Call('GET', `players/%23${tag}`)
    }
    static getClub(tag) {
        return this.Call('GET', `clubs/%23${tag}`)
    }
    static getBrawler(id) {
        return this.Call('GET', `brawlers/${id}`)
    }
    static getBrawlers() {
        return this.Call('GET', 'brawlers')
    }
}
module.exports = { BrawlStars }