const app = require('./app')

const dotenv = require('dotenv')

const connectDatabase = require('./database/database.js')

// Handling Uncaught Exception

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

//config
dotenv.config({path:'backend/config/config.env'})

// database connect

connectDatabase();


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})



// Unhandled promise rejection

process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})
