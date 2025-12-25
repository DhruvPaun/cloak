import mongoose from "mongoose";
type connectionObject =
    {
        isConnected?: Number
    }
const connection: connectionObject = {}
export async function dbConnection(): Promise<void> {
    try {
        if (connection.isConnected) {
            console.log("Already connected to Database");
            return;
        }
        const db = await mongoose.connect(process.env.MONGODB_URL||"")
        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        console.log("Error in connecting database", error);
        process.exit(1)
    }
}