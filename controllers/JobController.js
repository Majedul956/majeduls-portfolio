const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Job = require('../models/Job')
const Controller = vertex.Controller

class JobController extends Controller {
	constructor(){
		super(Job, process.env)
	}

	get(params) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Job.collectionName())
			.then(data => {
				return Job.find(params, Controller.parseFilters(params))
			})
			.then(jobs => {
				resolve(Job.convertToJson(jobs))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Controller.checkCollectionDB(Job.collectionName())
			.then(data => {
				return Job.findById(id)
			})
			.then(job => {
				if (job == null){
					throw new Error(Job.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(job.summary())
			})
			.catch(err => {
				reject(new Error(Job.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

	post(body) {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = vertex.utils.formattedDate()

			Job.create(body)
			.then(job => {
				payload = job.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Job.collectionName())
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
			Job.findByIdAndUpdate(id, params, {new:true})
			.then(job => {
				payload = job.summary()
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Job.collectionName())
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
			Job.findByIdAndRemove(id)
			.then(() => {
				return (process.env.TURBO_ENV=='dev') ? null : Controller.syncCollection(Job.collectionName())
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

module.exports = JobController
