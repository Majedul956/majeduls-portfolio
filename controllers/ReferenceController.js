const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Controller = vertex.Controller
const Reference = require('../models/Reference')

class ReferenceController extends Controller {
	constructor(){
		super(Reference, process.env)
	}

	get(params) {
		return new Promise((resolve, reject) => {
			Reference.find(params, Controller.parseFilters(params))
			.then(references => {
				resolve(Reference.convertToJson(references))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Reference.findById(id)
			.then(reference => {
				if (reference == null){
					throw new Error(Reference.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(reference.summary())
			})
			.catch(err => {
				reject(new Error(Reference.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

	post(body) {
		return new Promise((resolve, reject) => {
			body['dateString'] = vertex.utils.formattedDate()

			Reference.create(body)
			.then(reference => {
				resolve(reference.summary())
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	put(id, params) {
		return new Promise((resolve, reject) => {
			Reference.findByIdAndUpdate(id, params, {new:true})
			.then(reference => {
				resolve(reference.summary())
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			Reference.findByIdAndRemove(id)
			.then(() => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}
}

module.exports = ReferenceController
