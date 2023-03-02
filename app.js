const express = require('express');
require('dotenv').config();
const sequelize = require('./connection');
const userRoutes=   require('./src/routes/user');
const {createServer}=require('http');
const {Server}=require('socket.io');
const cors=require('cors');
const {createTracking,getTracking}=require('./src/utils/tracking')


const app = express();
const httpServer=createServer(app);

const io=new Server(httpServer,{
    cors:{
        origin:"*",
    }
})
app.use(express.json({ extended: false }));
app.use(cors());
//routes
app.use('/user',userRoutes);
//socket
io.on('connection',(socket)=>{
    console.log("socket connected",socket.id);
    socket.on('locationUpdate',async(data)=>{
        const {userId,lat,long}=data;
        const dataObject={
            userId:userId,
            lat:lat,
            long:long,
        }
       const create= await createTracking(dataObject);
         if(create){
            console.log("location updated",create);
            return socket.emit('locationUpdate',create);
         }
    })
    //get location of user
    socket.on('getLocation',async(userId)=>{
        const tracking=await getTracking(userId);
        if(tracking){
            return socket.emit('getLocation',tracking);
        }
        return socket.emit('error','No data found');
    })
})
sequelize.sync({ force: false });
//create server

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
