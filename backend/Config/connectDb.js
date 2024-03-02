import mongoose from "mongoose";


const connectDb = async () => {
    try {
        
      const conn = await mongoose.connect("mongodb+srv://Nisarg:Nisarg_2004@cluster0.mi6pyko.mongodb.net/Chat-System");
      console.log(
        `Conneted To Mongodb Databse` 
      );
    } catch (error) {
      console.log(`Error in Mongodb`);
    }
  };
  
  export default connectDb;