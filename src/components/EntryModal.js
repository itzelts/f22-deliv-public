import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories';
import { addEntry, updateEntry, deleteEntry } from '../utils/mutations';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QRCode from 'qrcode';

// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   This can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function EntryModal({ entry, type, user }) {

   // State variables for modal status

   // TODO: For editing, you may have to add and manage another state variable to check if the entry is being edited.

   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = React.useState(entry.category);
   const [imageUrl, setImageUrl] = useState('');
   const [QR, setQR] = useState('');

   const generateQrCode = async () => {
      try {
         const response = await QRCode.toDataURL(link);
         setImageUrl(response);
      }
      catch (error) {
         console.log(error);
      }
   }

   // Modal visibility handlers

   const handleClickOpen = () => {
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Mutation handlers

   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         userid: user?.uid,
      };

      addEntry(newEntry).catch(console.error);
      handleClose();
   };

   // Edit Mutation Handler
   const handleEdit = () => {
      const editedEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         userid: user?.uid,
         id: entry.id
      };
      updateEntry(editedEntry).catch(console.error);
      handleClose();
   };

   // Delete Mutation Handler
   const handleDelete = () => {
      deleteEntry(entry).catch(console.error);
      handleClose();
   }

   // QR Code Handler
   const handleQR = () => {
      generateQrCode();
      setQR(imageUrl);
   }

   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.
   // TODO: You may have to edit these buttons to implement editing/deleting functionality.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
            : null;

   const actionButtons =
      type === "edit" ?
         <DialogActions>
            <Button color="primary" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
               Delete</Button>
            <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleEdit}>
               Save Changes</Button>
         </DialogActions>
         : type === "add" ?
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;
   // Require link to generate QR
   let QRimage;
   if (!link) {
      QRimage = <p>must provide link</p>
   } else {
      QRimage = <img
         style={{ width: 200, height: 200 }}
         src={imageUrl}
         alt="img"
      />
   }

   return (
      <div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            <DialogContent>
               {/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
               <TextField
                  required
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  color="primary"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  required
                  margin="normal"
                  id="link"
                  label="Link"
                  placeholder="e.g. https://google.com"
                  fullWidth
                  color="primary"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  color='primary'
                  multiline
                  maxRows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
               />

               <FormControl fullWidth sx={{ "margin-top": 20 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={category}
                     label="Category"
                     onChange={(event) => setCategory(event.target.value)}
                  >
                     {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                  </Select>
               </FormControl>
            </DialogContent>
            {QR ? (
               <div
                  style={{
                     display: 'grid',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}
               >
                  {QRimage}
               </div>
            ) : (
               <DialogActions>
                  <Button variant="contained" size="medium" startIcon={<QrCodeIcon />} onClick={handleQR}>
                     Generate QR Code
                  </Button>
               </DialogActions>
            )}
            {QR ? (
               <div
                  style={{
                     display: 'grid',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}
               >
                  <img scr={QR} />
                  <DialogActions>
                     <Button href={QR} download="qrcode.png" variant="contained" size="medium" startIcon={<QrCodeIcon />} onClick={handleQR}> Download </Button>
                  </DialogActions>
               </div>
            ) : null}
            {actionButtons}
         </Dialog>
      </div>
   );
}