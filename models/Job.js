/*
  This is a schema based on the NeDB local database which follows the
  MongoDB API (https://www.npmjs.com/package/nedb). The 'camo' library
  is an ORM for the NeDB implementation.

  Eventually, this should be replaced by a MONGOOSE schema when used in
  conjunction with Mongo DB. This would happen in the case of a
  developer taking over the project.
*/

// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
	position: {type:String, default:'', display:true},
	company: {type:String, default:''},
	location: {type:String, default:''},
	start: {type:String, default:''},
	end: {type:String, default:''},
	description: {type:String, default:''},
	schema: {type:String, default:'job', immutable:true},
	dateString: {type:String, default:'', immutable:true},
	timestamp: {type:Date, default: new Date(), immutable:true}
}

class Job extends Document {
	constructor(){
		super()
		this.schema(props)

		// this is how to set default values on new instances
		this.timestamp = new Date()
	}

	static get resourceName(){
		return 'job'
	}

	static collectionName(){
			return 'jobs'
	}
}

module.exports = Job
