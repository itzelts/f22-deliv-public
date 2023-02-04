import { addDoc, collection, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';

// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
}

export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
   });
}

// Mutation to Update Entry
export async function updateEntry(entry) {
   // Identify correct entry; use auto-generated id from addDoc()
   const entryRef = doc(db, "entries", entry.id);
   // Update entry (referenced)
   await updateDoc(entryRef, {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      category: entry.category,
   });

}

// Mutation to Delete Entry
export async function deleteEntry(entry) {
   // Identify correct entry; use auto-generated id from addDoc()
   const entryRef = doc(db, "entries", entry.id);
   // Delete entry (referenced)
   await deleteDoc(entryRef);
}