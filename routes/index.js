const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const controllers = require('../controllers')
const CDN = (process.env.TURBO_ENV=='dev') ? null : process.env.CDN

router.get('/', (req, res) => {
	const data = {cdn: CDN}

	turbo.pageConfig('home', process.env.TURBO_API_KEY, process.env.TURBO_ENV)
	.then(homeConfig => {
		const skillStr = homeConfig.skill_section.skills
		const skillArray = skillStr.split(',')
		homeConfig.skill_section['skills'] = skillArray.map(skill => {
			//Javascript:95
			const skillParts = skill.split(':')
			if(skillParts.length > 1) {
				const skillObj = {}
				skillObj['name'] = skillParts[0]
				skillObj['pct'] = skillParts[1]
				return skillObj
			}
		})

		data['page'] = homeConfig
		return turbo.currentApp(process.env.TURBO_ENV)
		const jobCtr = new controllers.job()
		return jobCtr.get()
	})
	// .then(jobs => {
	// 	data['jobs'] = jobs
	// 	const schoolCtr = new controllers.school()
	// 	return schoolCtr.get()
	// })
	// .then(schools => {
	// 	data['schools'] = schools
	// 	const postsCtr = new controllers.post()
	// 	return postsCtr.get({limit:3})
	// })
	// .then(posts => {
	// 	data['posts'] = posts
	// 	return turbo.currentApp(process.env.TURBO_ENV)
	// })
	.then(site => {
		data['site'] = site
		data['global'] = site.globalConfig
		data['preloaded'] = JSON.stringify({
			page: data.page,
			global: data.global
		})

		res.render('index', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

// router.get('/blog', (req, res) => {
// 	const data = {cdn: CDN}

// 	let ctr = new controllers.post()
// 	ctr.get()
// 	.then(posts => {
// 		data['posts'] = posts
// 		return turbo.currentApp(process.env.TURBO_ENV)
// 	})
// 	.then(site => {
// 		data['site'] = site
// 		data['global'] = site.globalConfig
// 		res.render('blog', data)
// 	})
// 	.catch(err => {
// 		res.json({
// 			confirmation: 'fail',
// 			message: err.message
// 		})
// 	})
// })

// router.get('/post/:slug', (req, res) => {
// 	const data = {cdn: CDN}

// 	let ctr = new controllers.post()
// 	ctr.get({slug:req.params.slug})
// 	.then(posts => {
// 		if (posts.length == 0){
// 			throw new Error('Post '+req.params.slug+' not found.')
// 			return
// 		}

// 		data['post'] = posts[0]
// 		return turbo.currentApp(process.env.TURBO_ENV)
// 	})
// 	.then(site => {
// 		data['site'] = site
// 		data['global'] = site.globalConfig
// 		res.render('post', data)
// 	})
// 	.catch(err => {
// 		res.json({
// 			confirmation: 'fail',
// 			message: err.message
// 		})
// 	})
// })

module.exports = router








// // Full Documentation - https://docs.turbo360.co
// const express = require('express')
// const router = express.Router()
// const controllers = require('../controllers')

// /* *
//  * This is an example home route which renders the "home" 
//  * template using the 'home.json' file from the pages 
//  * folder to populate template data.
//  */
// router.get('/', (req, res) => {
// 	const data = req.context // {cdn:<STRING>, global:<OBJECT>}
// 	res.render('index', data) // render home.mustache	
// })

// /* *
//  * This is an example request for blog posts.
//  * REST resources are managed in the "controllers" directory 
//  * where all CRUD operations can be found and customized.
//  */
// router.get('/posts', (req, res) => {
// 	const data = req.context

// 	const postController = new controllers.post()
// 	postController.get()
// 	.then(posts => {
// 		res.json({
// 			confirmation: 'success',
// 			data: posts
// 		})
// 	})
// 	.catch(err => {
// 		res.json({
// 			confirmation: 'fail',
// 			message: err.message
// 		})
// 	})
// })

// module.exports = router
