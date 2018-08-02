require('dotenv').config(),
express=require('express')
app=express()
r=require('request')
path=require('path')
PORT=process.env.PORT||3100

app.use(express.static(path.resolve(__dirname + '/public')))

app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/public/project.html')
})

app.get('/api/jobs',(req,res)=>{
	let desc=req.query.description,
	loc=req.query.location,
	url = 'https://jobs.github.com/positions.json?description='+desc+'&location='+loc
	r(url,{json:true},(err,resp,body)=>
	{
		if(err) return res.json({
			error : 1,
			msg : err
		})

		let data = body.map(e=>{
			return {
				title : e.title,
				location : e.location,
				company : e.company,
				url : e.url
			}
		})
		res.status(200)
		res.json({
			error : 0,
			data : data
		})

})
	})

app.get('*',(req,res)=>{
	res.status(404)
	res.json({
		error:1,
		msg:"invalid api end point refer to our api docs to know more https://jobs.github.com"
	})
})
app.listen(PORT,err=>{
	if(err) return console.log(err)
		console.log(`server running at port number ${PORT}`)
})
