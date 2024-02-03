// CReate update read delete
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// crud operations
const {MongoClient, ObjectId, Collection} = require('mongodb')
// these are actually objects ;)

const connectionURL = 'mongodb://127.0.0.1:27017';
 const databaseName = 'task-manager';
// const ObjectId = mongodb.ObjectId
const id = new ObjectId()
// console.log(id.id)
//id property on id conytains raw vbinary info on id
// console.log(id.id.length)
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())
async function run() {
 const client = await MongoClient.connect(connectionURL);
 console.log("Connected correctly to server");

 const db = client.db(databaseName);
 // as you can see we passed the id to id actually
//  const result = await db.collection('users').insertOne({ _id: id ,name: 'vam', age: 27}, function(error, res) {
//     if(error)  {
//         return console.log("Unable to insert")
//     }
//  });
// //  const result = await db.collection('task').insertMany([{description: 'Connect database', completed : true },{description: 'BE Calm', completed : false }, {description: 'Callbacks?', completed : false }], function(error, res) {
// //     if(error)  {
// //         return console.log("Unable to insert")
// //     }
// //  });
//  console.log("No. of documents inserted" , result.insertedId );
//  const cursor = db.collection('task').find();
//  const tasks = await cursor.toArray();
//  console.log("Tasks in 'task' collection: ", tasks);

//  try {
//    const user = await db.collection('users').findOne({ _id: new ObjectId("65a530ab8acf46b27ed9816a")})
//    console.log("Fetched user: ", user);
//  } catch (error) {
//    console.log("Unable to fetch");
//  } finally {
//    await client.close();
//  }
// }
// const cursor = await db.collection('users').find({ age: 27})
//  const user = await cursor.toArray();
// console.log(user)
//  await client.close();

// }
// task 1
//  try {
//    const user = await db.collection('task').findOne({ _id: new ObjectId("65a539c5ce0b30e20b5eb154")})
//    console.log("Fetched user: ", user);
//  } catch (error) {
//    console.log("Unable to fetch");
//  } finally {
//    await client.close();
//  }
//  try {
//    const cursor = await db.collection('task').find({ completed : false})
//    const tasks = await cursor.toArray();
//    // since find will return a cursor
//    console.log("Fetched tasks: ", tasks);
//  } catch (error) {
//    console.log("Unable to fetch");
//  } finally {
//    await client.close();
//  }
// }
// const updatePromise = db.collection("users").updateOne({
//   _id : new ObjectId("65a542b6f4cc32a15a00a4f2")
// }, {
//   $set: {
//     name: "Shivi"
//   }
// })
// updatePromise.then((result) => {
//  console.log(result)
// }).catch((error) => {
//  console.log("error")
// })
//  try {
//   const filter = { completed : false}
//    const user = await db.collection('task').updateMany(filter, {
//     $set: {
//       completed: true
//     }
//    })
//    console.log("Fetched user: ", user);
//  } catch (error) {
//    console.log("Unable to fetch");
//  } finally {
//    await client.close();
//  }
// }
// try {
  
//    const user = await db.collection('users').deleteMany({
//     age: 22  
//    })
//    console.log("Deleted no of users: ", user.deletedCount);
//  } catch (error) {
//    console.log("Unable to fetch");
//  } finally {
//    await client.close();
//  }
// }
// delete one
try {
  
  const user = await db.collection('task').deleteOne({
   description: "Connect database"
  })
  console.log("Deleted no of users: ", user.deletedCount);
} catch (error) {
  console.log("Unable to fetch");
} finally {
  await client.close();
}
}
run().catch(console.dir);



