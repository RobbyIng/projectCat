class CatsApi {
    constructor(apiName) {
      this.url = `https://cats.petiteweb.dev/api/single/${apiName}`
  
    }
  
    getAllCats() {
      return fetch(`${this.url}/show`)
    }
  
    getCurrentCat(id) {
      return fetch(`${this.url}/show/${id}`)
    }
    
    deleteCat(id) {
      return fetch(`${this.url}/delete/${id}`, {
        method: 'DELETE',
      })
    }

    addNewCat(data) {
      return fetch(`${this.url}/add`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    }

    editCat(id, data) {
      return fetch(`${this.url}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    }
  }
  
  const api = new CatsApi(dbName)  