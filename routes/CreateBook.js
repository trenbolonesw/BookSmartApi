import express from 'express'
import { db } from '../connect.js';

import multer from 'multer';




const PostRouter = express.Router();

 


 
const storage = multer.memoryStorage(); // keeps file in RAM
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

PostRouter.post('/createbook',upload.fields([
  {name:'image',maxCount:1},
  {name:'pdf',maxCount:1}
]),(req,res) => {
    console.log('BODY:', req.body);   // Should have title and description
    console.log('FILE:', req.file);   // Should NOT be null
    const {title,description,date,author,about,category} = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;
     const finalDate = date || new Date().toISOString();
     
   
     const addBook = 'INSERT INTO books(book_title, book_description,book_cover,book_date,book_author,book_aboutAuthor,book_category,book_pdf) VALUES (?, ?,?,?,?,? ,?,?)'

      let newId;
      
      

   try{

        db.run(addBook, [title,description,imageBuffer,finalDate,author,about,category], 
          function(err){
            console.log(err)

             newId = this.lastID
             res.status(201).json({
                status:201,
          message:`book ${newId} saved`
             })
           
          }
        )


   }catch(e){
    console.log(e)
    res.status(468)
    res.send(`{"code": 468,"status": "${e.message}"}`)
   }

})

PostRouter.patch('/createbook/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), (req, res) => {
  const id = req.params.id;
const updates = req.body || {};
const files = req.files || {};
  const updateKeys = Object.keys(updates);
  const values = [];

  // If an image is uploaded, add it to the updates
  if (files?.image && files.image.length > 0) {
  updates.book_cover = files.image[0].buffer;
  updateKeys.push('book_cover');
}

if (files?.pdf && files.pdf.length > 0) {
  updates.book_pdf = files.pdf[0].buffer;
  updateKeys.push('book_pdf');
}

  // Handle the case where no fields are sent at all
  if (updateKeys.length === 0) {
    return res.status(400).json({ message: "No updates provided" });
  }

  // Construct SQL set clause
  const setClause = updateKeys.map(key => `${key} = ?`).join(', ');
  updateKeys.forEach(key => values.push(updates[key]));
  values.push(id); // For WHERE clause

  const sql = `UPDATE books SET ${setClause} WHERE book_id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully', changes: this.changes });
  });
});

PostRouter.post('/testupload', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  res.json({ message: 'Received', body: req.body, files: req.files });
});



PostRouter.get('/download/:id', (req,res) => {
  const bookId = req.params.id;

  const query = 'SELECT book_title, book_pdf FROM books WHERE book_id = ?';


  db.get(query,[bookId], (err,row) => {
    if(err){
        console.error('DB error:', err);
      return res.status(500).send('Internal server error');
    
    }

    const filename = `${row.book_title.replace(/\s+/g, '_')}.pdf`;
   
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
   
    res.end(row.book_pdf)

  })
})



export default PostRouter
