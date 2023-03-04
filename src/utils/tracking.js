const TrackingModel = require('../models/tracking');
const UserModel = require('../models/user');


module.exports = {
    //create tracking data or update tracking data
    createTracking: async (data) => {
        try {
            let trackingData;
            //check if record exists
            const tracking = await TrackingModel.findOne({ where: { userId: data.userId } });
            //if exits update
            if(tracking){
               await TrackingModel.update({lat:data.lat,long:data.long},{where:{userId:data.userId}});
                trackingData=await TrackingModel.findOne({where:{userId:data.userId}});
               
            }else{
                //if not create
                trackingData= await TrackingModel.create(data);
            }
            return trackingData;
        } catch (err) {
            return err;
        }
    },
    getTracking: async (data) => {
        try {
            const tracking = await TrackingModel.findOne({ where: { userId:data } });
            if(tracking){
                //get user data
                const user=await  UserModel.findOne({where:{id:tracking.userId},attributes:['id','name','email']});
                console.log(user);
                return {
                    user:user,
                    tracking:tracking
                }
            }
            return null;
        } catch (err) {
            return err;
        }
    },
}