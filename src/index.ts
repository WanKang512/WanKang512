import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import path from 'path'

const app = express()

app.use(express.json())
dotenv.config({ path: path.join(__dirname, '..', '.env') })

app.post('/', (req: Request, res: Response) => {
	console.log(req.body)
	res.json({ status: 'success', code: '200', message: 'complete!' })
})

app.listen('3001', () => {
	console.log('233333')
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
