import mongoose from "mongoose";
const connectDB = (url) => {
    mongoose.set("strictQuery", false);
    mongoose.connection.on("open", () => {
        let db = mongoose.connections[0].db;
        //mongoose.files = new mongoose.mongo.GridFSBucket(db);
    });
    return mongoose.connect(url);
};
export default connectDB;
//# sourceMappingURL=db.js.map