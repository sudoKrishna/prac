//   1 . Promisify a callback API that has multiple 
// success values (callback(err, a, b)) — 
// util.promisify only gives you a. How do you handle it? 🪤

import { resolve } from "bun";
import { couldStartTrivia } from "typescript";


// import { promisify } from "node:util";

// function getUser(callback: (err: Error | null, user?: string) => void) {
//     callback(null, "Krishna");
// }

// async function main() {
//     const getUserPromise = promisify(getUser);
//     const user = await getUserPromise();
//     console.log(user);
// }

// main();
// function getData(callback :Function) {
//     const name = "krishna";
//     const age = 20;

//     callback(null , name , age)
// }

// function getUser(): Promise<{ name: string; age: number }> {
//     return new Promise((resolve, reject) => {
//         getData((err: any, name: any, age: any) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve({ name, age });
//             }
//         });
//     });
// }

// async function main() {
//     const user = await getUser();
//     console.log(user);
// }
// main()

// const util = require("node:util")

// function getUserData(callback) {
//     setTimeout(() => {
//         callback(null , "RAhul" , 334)
//     }, 1000)
// }

// getUserData[util.promisify.custom] = function () {
//     return new Promise((resolve , reject) => {
//         getUserDate((err , name , age) => {
//            if(err) {
//             reject(err)
//            }
//            else {
//             resolve({name , age})
//            }
//         }) 
//     })
// }

// const getUserDataPromise = util.promisify(getUserData)
// (async () => {
//     const user = await getUserDataPromise();

//     console.log(user)
// })

// In the interview
// Q .What if callback is callback(err, a, b)? util.promisify only returns a

//- by default util.promisify() resolve only the first success argument .
// if the callback returns mutilple success value , i would manully wrap it in the promise
// and resolve an object or array containing all valuse . if i own the api 
// i can also define util.promisify.custom() to customisize the promisifed behavior.

// function promisify(fn : any) {
//     return function(...args : any[]) {
//      return new Promise((resolve , reject) => {
//         const callback = (err : any ,result : any) => {
//             if(err) {
//                 reject(err)
//              } else {
//                 resolve(result)
//              }
//         }
//         fn.call(this , ...args , callback)
//      })
//     }
// }

// const user = {
//     name : "rahul",
    
//     getName(callback :any) {
//         callback(null , this.name)
//     }

// }

// user.getName((err :any , name :any ) => {
//     console.log(name)
// })

// Implement Promise.all from scratch.
// Now implement Promise.any — what does it reject with? (AggregateError)

// function myPromiseAll(promises : any) {
// return new Promise((resolve , reject) => {
//     const result : any = [];
//     let completed = 0

//     if(promises.length === 0) {
//         resolve([])
//     }
//     promises.forEach((promise : any, index : any) => {
//         Promise.resolve(promise)
//         .then(value => {
//             result[index] = value;

//             completed++;

//             if(completed === promise.length) {
//                 resolve(result)
//             }
//         })
//         .catch(reject)
//     })
// })
// }

// part 2

// async function promiseAll() {
//     try {
//         await Promise.any([
//           Promise.reject("A"),
//           Promise.reject("B")
//         ])
//     } catch (err) {
//         console.log(err)
//     }
// }

// promiseAll();

// in the bun the error look like other type 
// check 
// async function test() {
//     try {
//         await Promise.any([
//             Promise.reject("A"),
//             Promise.reject("B"),
//         ]);
//     } catch (err : any) {
//         console.log(err instanceof AggregateError);
//         console.log(err.name);
//         console.log(err.message);
//         console.log(err.errors);
//     }
// }

// test();


// function myPromiseAny(promises: any[]) {
//   return new Promise((resolve, reject) => {
//     const errors: any[] = [];
//     let rejectCount = 0;

//     if (promises.length === 0) {
//       reject(new AggregateError([], "All promises were rejected"));
//       return;
//     }

//     promises.forEach((promise, index) => {
//       Promise.resolve(promise)
//         .then(resolve)
//         .catch(error => {
//           errors[index] = error;
//           rejectCount++;

//           if (rejectCount === promises.length) {
//             reject(
//               new AggregateError(
//                 errors,
//                 "All promises were rejected"
//               )
//             );
//           }
//         });
//     });
//   });
// }

// myPromiseAny([
//     Promise.reject("A"),
//     Promise.reject("B")
// ])
// .catch(err => {

//     console.log(err instanceof AggregateError);

//     console.log(err.errors);

// });
// myPromiseAny([
//     Promise.reject("Server Error"),
//     Promise.reject("Timeout"),
//     Promise.resolve("Success")
// ])
// .then(console.log)
// .catch(console.error);

 // Implement a promiseAllLimit(tasks, concurrency) — run max N promises at a time.

// function promiseAllLimit(tasks : any , limit : any) {
//     return new Promise((resolve, reject) => {
//         const results : any[] = [];

//         let running = 0;
//         let completed = 0;
//         let index = 0;

//         function runNext() {
//           if(completed === tasks.length) {
//             resolve(results)
//             return;
//           }
        

//         while(running < limit && index < tasks.length) {
//             const currentIndex = index;
//             const task  = tasks[index]

//             index++;
//             running++;

//             task().then((result : any) => {
//                 results[currentIndex]= result;
//             })
//             .catch(reject) 
//             .finally(() => {
//                 running--;
//                 completed++;
//                 runNext()
//             })
//         }
//     }
//     runNext()

//     })
// }


// const delay = (value: any, time: number) => () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log(value);
//             resolve(value);
//         }, time);
//     });
// };


// const tasks = [
//     delay("A", 1000),
//     delay("B", 500),
//     delay("C", 200)
// ];


// promiseAllLimit(tasks, 2)
//     .then(console.log)
//     .catch(console.error);

// Q - 5 Your Promise.all is passed 1000 promises and one rejects at index 3.
// Do the other 997 stop executing? 🪤 
// (No — they're already running. Explain why.)

// answer - "Promise.all() does not cancel pending promises when one rejects.
//  All promises have already started executing because promises are eager. 
// Promise.all() only changes its own state to rejected and stops waiting for success values.
//  If cancellation is required, it must be implemented separately using mechanisms 
// like AbortController."


// function task(name:any , time : number) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             console.log(name)
//             resolve(name)
//         }, time)
//     })
// }

// Promise.all([
//     task("a", 3000),
//     Promise.reject("B failed"),
//     task("c" ,2000),
//     task("d", 1000)
// ]).catch(console.log)
