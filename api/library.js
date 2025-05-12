

import express from 'express'
import cors from 'cors'
import {db} from '../connect.js'
import bodyParser from 'body-parser'



const myRouter = express.Router();

  myRouter.use(bodyParser.json())
  myRouter.use(cors())    

        myRouter.get('/librarybooks', (req, res) => {
  const sql = 'SELECT * FROM books';
  const data = { books: [] };

  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: 'Database error' });
      }

      const books = rows.map(row => {
        let imageDataUrl = null;

        if (row.book_cover && row.book_cover.length > 0) {
          try {
            const base64 = Buffer.from(row.book_cover).toString('base64');
            imageDataUrl = `data:image/jpeg;base64,${base64}`;
          } catch (e) {
            console.warn(`Error encoding image for book ID ${row.book_id}:`, e);
          }
        }

        return {
          id: row.book_id,
          title: row.book_title,
          description: row.book_description,
          cover: imageDataUrl,
          date:row.book_date,
          author:row.book_author,
          about:row.book_aboutAuthor,
          category:row.book_category
        };
      });

      res.status(200).json({ books });
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    res.status(500).json({ error: 'Internal server error' });
  }
});


          myRouter.get('/librarybooks/:id',(req,res) => {
            

            const sql = `SELECT * FROM books WHERE book_id = ? `
            const rowId = req.params.id
            
            
            try{
              db.get(sql,[rowId],(err,rows) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ error: 'Database error' });
                  return;
                }
                if(rows){

                  let imageBase64 = rows.book_cover
                  ? Buffer.from(rows.book_cover).toString('base64')
                   : null;
                   let imageDataUrl = imageBase64
                   ? `data:image/jpeg;base64,${imageBase64}`
                   : null;


                  res.json({
                    id: rows.book_id,
                    title: rows.book_title,
                    description: rows.book_description,
                    cover: imageDataUrl ,
                    date:rows.book_date,
                    author:rows.book_author,
                    about:rows.book_aboutAuthor,
                    category:rows.book_category
                  })
                }
                else {
                  res.status(404).json({ error: 'Book not found' });
                }
                

               
              })
            }catch(e){
              console.log(e)
            }

          })


          
     

      myRouter.delete('/librarybooks',(req,res) => {
           
             res.set('content-type','application/json') 
             const sql = 'DELETE FROM books WHERE book_id=?'
            try{

              db.run(sql,[req.query.id],function(err){
              
                if(err) 
                  throw err

                if(this.changes === 1){
                  res.status(200)
                  res.send(`{'message':"book ${req.query.id} was removed from library"}`)
                    
                }else{
                  res.status(404)
                  res.send({'message':"ID not found"})
                }
                
             } )
            
           }catch(e){
            console.log(e)
            res.status(468)
            res.send(`{"code":468,"status":"${e.message}}`)
           }
      })

      
  
myRouter.get('/',(req,res) => {
    res.status(200)
    res.send("welcome to my books!")
})



export default myRouter;