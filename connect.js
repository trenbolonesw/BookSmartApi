import sqlite3 from 'sqlite3'

const sql = sqlite3.verbose()

const db = new sql.Database("./librarydb.db",sqlite3.OPEN_READWRITE,connected)


function connected(err){
   
     if(err){
        console.log(err.message)
        return
     }
} 

let sql3 = `CREATE TABLE IF NOT EXISTS books(

book_id INTEGER PRIMARY KEY,
book_title TEXT NOT NULL,
book_description TEXT NOT NULL,
book_cover BLOB,
book_date TEXT NOT NULL,
book_author TEXT NOT NULL,
book_aboutAuthor TEXT NOT NULL,
book_category TEXT NOT NULL,
book_pdf BLOB
)`

db.run(sql3,[], (err)=> {
    if(err){
 console.log("database failed!")
 return;
    }

    console.log('CREATED TABLE')
});




export {db}