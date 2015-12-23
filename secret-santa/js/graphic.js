"use strict"

var db = {}
db.media = {type:"desktop", width: window.innerWidth, height: window.innerHeight, init: {mobile:false, desktop:false}}
db.mediaTest = function(){
	db.media.width = window.innerWidth
	db.media.height = window.innerHeight
	db.media.type = db.media.width>768? "desktop" : "mobile"
	d3.select('body').classed("mobile", db.media.type=="mobile")
}

;(function(){

	function initGraphic(){
		enableEvents()
	}

	var dispatch = d3.dispatch("submitname")
	var inputs = d3.selectAll('.nameput input')

	function enableEvents(){
		inputs = d3.selectAll('.nameput input')
		inputs.on('keyup', nameCheck)
		d3.selectAll('.submitname').on('click', nameSubmit)
		d3.selectAll('.editname').on('click', nameEdit)
		d3.selectAll('.newname').on('click', nameNew)
		d3.selectAll('.deletename').on('click', nameDelete)
		d3.selectAll('.assign').on('click', nameAssign)
		d3.selectAll('.editlist').on('click', editList)
		d3.selectAll('.inputval').on('click', showAssignment)
	}

	function nameCheck(){
		var el = d3.event.srcElement
			, sel = d3.select(el)
			, papa = d3.select(sel.node().parentElement)
		
		papa.classed('okay', el.value.length >= 1)
		papa.select('.inputval').text(el.value)

		if(el.value.length >= 1 && d3.event.keyCode == 13){
			dispatch.submitname(papa.select('.submitname').node())
		}

		d3.select('#santaslist').classed('assignable', d3.selectAll('.namelist .nameput.okay')[0].length>1 )
	}

	function nameSubmit(elmnt){
		var el = elmnt || d3.event.srcElement
			, sel = d3.select(el)
			, papa = d3.select(sel.node().parentElement)

		papa.classed('submitted', true)
	}

	function nameEdit(){
		var el = d3.event.srcElement
			, sel = d3.select(el)
			, papa = d3.select(sel.node().parentElement)
		
		papa.classed('okay', true)
		papa.classed('submitted', false)	
	}

	function nameNew(){

		var nameput = d3.select('.namelist').append('li')
			.attr('class', 'nameput added')

		nameput.append('div').attr('class', 'btn-sim btn-inline submitname').text('✔')
		nameput.append('div').attr('class', 'btn-sim btn-inline editname').text('✍')
		nameput.append('div').attr('class', 'btn-sim btn-inline deletename').text('✖')
		nameput.append('input').attr('placeholder', 'Name').attr("type", "text").attr("name", "input")
		nameput.append('p').attr('class', 'inputval')

		enableEvents()
	}

	function nameDelete(){
		var el = d3.event.srcElement
			, sel = d3.select(el)
			, papa = d3.select(sel.node().parentElement)
		
		papa.remove()
		d3.select('#santaslist').classed('assignable', d3.selectAll('.namelist .nameput.okay')[0].length>1 )
	}

	function nameAssign(){
		var viable = []
		d3.selectAll('.namelist .nameput').each(function(){
			var sel = d3.select(this)
			if(!sel.classed('okay')) sel.remove()
			else viable.push(sel.select('.inputval'))
			if(!sel.classed('submitted')) sel.classed('submitted', true)
		})

		d3.selectAll('#santaslist').classed('assigned', true)

		var count = 0
		function assign(array){
			if(count == viable.length) return

			var result = randomChoice(1, array, true)
			var chosen = result.chosen[0]//.select('.inputval').text()
			
			if(viable[count] == chosen){

				if(count == viable.length-1){
					count = 0
					// console.log('----try again----')
					assign(viable)
				} else {
					assign(array)
				}

			} else if(count < viable.length){

				viable[count].node().__data__ = {
					name: viable[count].text(),
					assigned: result.chosen[0].text()
				}
				// console.log(viable[count].node().__data__)
				count++
				assign(result.remaining)
			}

		}
		assign(viable)
	}


	function randomChoice(n, arrayset, eliminate){
		var output = [],
			set = [].concat(arrayset)
		for(var i=0; i<n; i++){
			if(set.length<1) break;
			var rando = Math.floor(Math.random()*set.length)
			output.push( set.splice(rando,1)[0] )
		}
		return eliminate? {chosen:output, remaining:set} : output
	}

	function editList(){
		d3.selectAll('#santaslist').classed('assigned', false)
	}


	var bgcolors  = ['rgba(239,66,86,0.875)', 'rgba(97,188,83,0.875)']
	var phrases = ["Hope they like it", "Lucky you", "What a treat", "Better start taking notes", "If they're not naughty", "It's a Christmas miracle"]

	function showAssignment(d){
		if(!d3.selectAll('#santaslist').classed('assigned')) return

		var flip = Math.floor(Math.random()*bgcolors.length)
		var phn = Math.floor(Math.random()*phrases.length)

		var box = d3.select('#inner-content').append('div')
			.attr('class', 'expbox')
			.style('background-color', bgcolors[flip])
			.style('width', db.media.width+"px")
			.style('height', db.media.height+"px")
			.on('click', function(){d3.select('.expbox').remove()})

		var tb = box.append('div').attr('class', 'tablecell').html('<p>Santa '+d.name+' <br>you\'re getting a gift for <br> '+d.assigned+'</p> <p>✴ '+phrases[phn]+' ✴</p>')
	}


	db.mediaTest()
	initGraphic()


	d3.rebind(inputs, dispatch, "on")
	inputs.on('submitname', function(elmnt){
		nameSubmit(elmnt)
	})
	


	d3.select(window).on('resize.graphic', _.debounce(function(){
		db.mediaTest()
		d3.select('.expbox').remove()
	}, 250))

})()


