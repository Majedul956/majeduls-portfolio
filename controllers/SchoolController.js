const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Controller = vertex.Controller
const School = require('../models/School')

class SchoolController extends Controller {
	constructor(){
		super(School, process.env)
	}

	get(params) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(School.collectionName())
			.then(data => {
				return School.find(params, Controller.parseFilters(params))
			})
			.then(schools => {
				resolve(School.convertToJson(schools))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(School.collectionName())
			.then(data => {
				return School.findById(id)
			})
			.then(school => {
				if (school == null){
					throw new Error(School.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(school.summary())
			})
			.catch(err => {
				reject(new Error(School.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

	post(body) {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = vertex.utils.formattedDate()

			School.create(body)
			.then(school => {
				payload = school.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(School.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	put(id, params) {
		return new Promise((resolve, reject) => {
			let payload = null
			School.findByIdAndUpdate(id, params, {new:true})
			.then(school => {
				payload = school.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(School.collectionName())
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			School.findByIdAndRemove(id)
			.then(() => {
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(School.collectionName())
			})
			.then(data => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}
}

module.exports = SchoolController
